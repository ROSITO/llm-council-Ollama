"""
Exemple d'implémentation du client Ollama.
Ce fichier montre comment migrer de openrouter.py vers ollama.py.

À renommer en ollama.py une fois validé.
"""

import httpx
from typing import List, Dict, Any, Optional
from .config import OLLAMA_API_URL


async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Query a single model via Ollama API.
    
    Args:
        model: Ollama model name (e.g., "llama3", "mistral")
        messages: List of message dicts with 'role' and 'content'
        timeout: Request timeout in seconds
    
    Returns:
        Response dict with 'content' and optional 'reasoning_details', or None if failed
    """
    # Ollama API endpoint
    url = f"{OLLAMA_API_URL}/chat"
    
    payload = {
        "model": model,
        "messages": messages,
        "stream": False  # Set to True for streaming (not implemented here)
    }
    
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            
            data = response.json()
            
            # Ollama response format is different from OpenRouter
            # OpenRouter: data['choices'][0]['message']['content']
            # Ollama: data['message']['content']
            message = data.get('message', {})
            content = message.get('content')
            
            # Check if content is None or empty
            if content is None or (isinstance(content, str) and len(content.strip()) == 0):
                print(f"Warning: Empty content from {model}. Full response: {data}")
                return None
            
            # Ollama doesn't have 'reasoning_details', but we keep the interface compatible
            return {
                'content': content,
                'reasoning_details': None  # Ollama doesn't provide this
            }
    
    except httpx.ConnectError:
        error_msg = f"Cannot connect to Ollama at {OLLAMA_API_URL}. Is Ollama running?"
        print(f"Error querying model {model}: {error_msg}")
        return None
    except httpx.HTTPStatusError as e:
        error_detail = f"HTTP {e.response.status_code}: {e.response.text}"
        print(f"Error querying model {model}: {error_detail}")
        return None
    except Exception as e:
        import traceback
        error_detail = f"{type(e).__name__}: {str(e)}"
        print(f"Error querying model {model}: {error_detail}")
        print(f"Traceback: {traceback.format_exc()}")
        return None


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Query multiple models in parallel.
    
    Args:
        models: List of Ollama model names
        messages: List of message dicts to send to each model
    
    Returns:
        Dict mapping model name to response dict (or None if failed)
    """
    import asyncio
    
    # Create tasks for all models
    tasks = [query_model(model, messages) for model in models]
    
    # Wait for all to complete
    responses = await asyncio.gather(*tasks)
    
    # Map models to their responses
    return {model: response for model, response in zip(models, responses)}


async def check_ollama_available() -> bool:
    """
    Check if Ollama service is available.
    
    Returns:
        True if Ollama is running, False otherwise
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_API_URL.replace('/api/chat', '')}/api/tags")
            return response.status_code == 200
    except Exception:
        return False


async def list_available_models() -> List[str]:
    """
    List all available Ollama models.
    
    Returns:
        List of model names
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_API_URL.replace('/api/chat', '')}/api/tags")
            response.raise_for_status()
            data = response.json()
            return [model['name'] for model in data.get('models', [])]
    except Exception as e:
        print(f"Error listing models: {e}")
        return []

