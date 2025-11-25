"""FastAPI backend for LLM Council."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import uuid
import json
import asyncio

from . import storage
from .council import run_full_council, generate_conversation_title, stage1_collect_responses, stage2_collect_rankings, stage2_5_debate, stage3_synthesize_final, calculate_aggregate_rankings
from .providers import OpenRouterProvider, OllamaProvider, get_provider, set_provider
from .config import OPENROUTER_API_KEY, OPENROUTER_API_URL
import random

app = FastAPI(title="LLM Council API")

# Initialize default provider (OpenRouter if key available, otherwise Ollama)
# This will be overridden when user sets config via /api/config/set
@app.on_event("startup")
async def startup_event():
    if OPENROUTER_API_KEY:
        set_provider(OpenRouterProvider(OPENROUTER_API_KEY, OPENROUTER_API_URL))
    else:
        set_provider(OllamaProvider())

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CreateConversationRequest(BaseModel):
    """Request to create a new conversation."""
    pass


class SendMessageRequest(BaseModel):
    """Request to send a message in a conversation."""
    content: str


class ConversationMetadata(BaseModel):
    """Conversation metadata for list view."""
    id: str
    created_at: str
    title: str
    message_count: int


class CouncilConfig(BaseModel):
    """Configuration for the LLM Council."""
    provider: str  # "openrouter" or "ollama"
    models: List[str]  # List of model names
    num_models: int  # Number of models to use (will select randomly if more provided)
    chairman_random: bool = True  # If True, select chairman randomly from models


class SetConfigRequest(BaseModel):
    """Request to set council configuration."""
    provider: str
    models: List[str]
    num_models: int
    chairman_random: bool = True


class Conversation(BaseModel):
    """Full conversation with all messages."""
    id: str
    created_at: str
    title: str
    messages: List[Dict[str, Any]]


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "LLM Council API"}


@app.get("/api/config/models")
async def list_models(provider: str = "auto"):
    """
    List available models for a provider.
    
    Args:
        provider: "openrouter", "ollama", or "auto" (detect available)
    """
    if provider == "auto":
        # Try Ollama first, then OpenRouter
        ollama = OllamaProvider()
        if await ollama.is_available():
            models = await ollama.list_available_models()
            return {"provider": "ollama", "models": models, "available": True}
        elif OPENROUTER_API_KEY:
            openrouter = OpenRouterProvider(OPENROUTER_API_KEY, OPENROUTER_API_URL)
            models = await openrouter.list_available_models()
            return {"provider": "openrouter", "models": models, "available": True}
        else:
            return {"provider": None, "models": [], "available": False}
    elif provider == "ollama":
        ollama = OllamaProvider()
        available = await ollama.is_available()
        models = await ollama.list_available_models() if available else []
        return {"provider": "ollama", "models": models, "available": available}
    elif provider == "openrouter":
        if not OPENROUTER_API_KEY:
            return {"provider": "openrouter", "models": [], "available": False}
        openrouter = OpenRouterProvider(OPENROUTER_API_KEY, OPENROUTER_API_URL)
        models = await openrouter.list_available_models()
        return {"provider": "openrouter", "models": models, "available": True}
    else:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {provider}")


@app.post("/api/config/set")
async def set_config(request: SetConfigRequest):
    """
    Set the council configuration and switch provider.
    
    Args:
        request: Configuration including provider, models, and num_models
    """
    from .council import set_council_config
    
    # Select models (randomly if more than num_models)
    selected_models = request.models.copy()
    if len(selected_models) > request.num_models:
        selected_models = random.sample(selected_models, request.num_models)
    
    # Switch provider
    if request.provider == "openrouter":
        if not OPENROUTER_API_KEY:
            raise HTTPException(status_code=400, detail="OpenRouter API key not configured")
        set_provider(OpenRouterProvider(OPENROUTER_API_KEY, OPENROUTER_API_URL))
    elif request.provider == "ollama":
        ollama = OllamaProvider()
        if not await ollama.is_available():
            raise HTTPException(status_code=400, detail="Ollama is not available. Is it running?")
        set_provider(ollama)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown provider: {request.provider}")
    
    # Select chairman
    if request.chairman_random:
        chairman = random.choice(selected_models) if selected_models else None
    else:
        chairman = selected_models[0] if selected_models else None
    
    # Set the council configuration
    if selected_models and chairman:
        set_council_config(selected_models, chairman)
    
    # Store config in a simple way (could be improved with proper storage)
    config = {
        "provider": request.provider,
        "models": selected_models,
        "chairman": chairman,
        "num_models": len(selected_models)
    }
    
    return {
        "status": "ok",
        "config": config,
        "message": f"Configured {len(selected_models)} models from {request.provider}"
    }


@app.get("/api/config/current")
async def get_current_config():
    """Get current configuration."""
    provider = get_provider()
    provider_name = "openrouter" if isinstance(provider, OpenRouterProvider) else "ollama"
    models = await provider.list_available_models()
    
    return {
        "provider": provider_name,
        "available_models": models,
        "available": await provider.is_available()
    }


@app.get("/api/conversations", response_model=List[ConversationMetadata])
async def list_conversations():
    """List all conversations (metadata only)."""
    return storage.list_conversations()


@app.post("/api/conversations", response_model=Conversation)
async def create_conversation(request: CreateConversationRequest):
    """Create a new conversation."""
    conversation_id = str(uuid.uuid4())
    conversation = storage.create_conversation(conversation_id)
    return conversation


@app.get("/api/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """Get a specific conversation with all its messages."""
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@app.post("/api/conversations/{conversation_id}/message")
async def send_message(conversation_id: str, request: SendMessageRequest):
    """
    Send a message and run the 3-stage council process.
    Returns the complete response with all stages.
    """
    # Check if conversation exists
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if this is the first message
    is_first_message = len(conversation["messages"]) == 0

    # Add user message
    storage.add_user_message(conversation_id, request.content)

    # If this is the first message, generate a title
    if is_first_message:
        title = await generate_conversation_title(request.content)
        storage.update_conversation_title(conversation_id, title)

    # Run the 3-stage council process (now with debate)
    # Configuration should be set via /api/config/set before sending messages
    stage1_results, stage2_results, stage2_5_debate, stage3_result, metadata = await run_full_council(
        request.content
    )

    # Add assistant message with all stages
    storage.add_assistant_message(
        conversation_id,
        stage1_results,
        stage2_results,
        stage2_5_debate,
        stage3_result
    )

    # Return the complete response with metadata
    return {
        "stage1": stage1_results,
        "stage2": stage2_results,
        "stage2_5": stage2_5_debate,
        "stage3": stage3_result,
        "metadata": metadata
    }


@app.post("/api/conversations/{conversation_id}/message/stream")
async def send_message_stream(conversation_id: str, request: SendMessageRequest):
    """
    Send a message and stream the 3-stage council process.
    Returns Server-Sent Events as each stage completes.
    """
    # Check if conversation exists
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if this is the first message
    is_first_message = len(conversation["messages"]) == 0

    async def event_generator():
        try:
            # Add user message
            storage.add_user_message(conversation_id, request.content)

            # Start title generation in parallel (don't await yet)
            title_task = None
            if is_first_message:
                title_task = asyncio.create_task(generate_conversation_title(request.content))

            # Stage 1: Collect responses
            yield f"data: {json.dumps({'type': 'stage1_start'})}\n\n"
            stage1_results = await stage1_collect_responses(request.content)
            yield f"data: {json.dumps({'type': 'stage1_complete', 'data': stage1_results})}\n\n"

            # Stage 2: Collect rankings
            yield f"data: {json.dumps({'type': 'stage2_start'})}\n\n"
            stage2_results, label_to_model = await stage2_collect_rankings(request.content, stage1_results)
            aggregate_rankings = calculate_aggregate_rankings(stage2_results, label_to_model)
            yield f"data: {json.dumps({'type': 'stage2_complete', 'data': stage2_results, 'metadata': {'label_to_model': label_to_model, 'aggregate_rankings': aggregate_rankings}})}\n\n"

            # Stage 2.5: Debate
            from .council import stage2_5_debate
            yield f"data: {json.dumps({'type': 'stage2_5_start'})}\n\n"
            debate_rounds = await stage2_5_debate(request.content, stage1_results, stage2_results, num_tours=2)
            yield f"data: {json.dumps({'type': 'stage2_5_complete', 'data': debate_rounds})}\n\n"

            # Stage 3: Synthesize final answer
            yield f"data: {json.dumps({'type': 'stage3_start'})}\n\n"
            from .council import stage3_synthesize_final
            stage3_result = await stage3_synthesize_final(request.content, stage1_results, stage2_results, debate_rounds)
            yield f"data: {json.dumps({'type': 'stage3_complete', 'data': stage3_result})}\n\n"

            # Wait for title generation if it was started
            if title_task:
                title = await title_task
                storage.update_conversation_title(conversation_id, title)
                yield f"data: {json.dumps({'type': 'title_complete', 'data': {'title': title}})}\n\n"

            # Save complete assistant message
            storage.add_assistant_message(
                conversation_id,
                stage1_results,
                stage2_results,
                debate_rounds,
                stage3_result
            )

            # Send completion event
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"

        except Exception as e:
            # Send error event
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
