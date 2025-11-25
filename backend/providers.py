"""
Abstraction layer for LLM providers (OpenRouter, Ollama, etc.)
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import httpx


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    @abstractmethod
    async def query_model(
        self,
        model: str,
        messages: List[Dict[str, str]],
        timeout: float = 120.0
    ) -> Optional[Dict[str, Any]]:
        """
        Query a single model.
        
        Returns:
            Dict with 'content' and optional 'reasoning_details', or None if failed
        """
        pass
    
    @abstractmethod
    async def list_available_models(self) -> List[str]:
        """List all available models for this provider."""
        pass
    
    @abstractmethod
    async def is_available(self) -> bool:
        """Check if the provider is available."""
        pass


class OpenRouterProvider(LLMProvider):
    """OpenRouter API provider."""
    
    def __init__(self, api_key: str, api_url: str = "https://openrouter.ai/api/v1/chat/completions"):
        self.api_key = api_key
        self.api_url = api_url
    
    async def query_model(
        self,
        model: str,
        messages: List[Dict[str, str]],
        timeout: float = 120.0
    ) -> Optional[Dict[str, Any]]:
        """Query OpenRouter API."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "model": model,
            "messages": messages,
        }
        
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(self.api_url, headers=headers, json=payload)
                response.raise_for_status()
                
                data = response.json()
                
                if 'choices' not in data or len(data['choices']) == 0:
                    print(f"Unexpected response structure from {model}: {data}")
                    return None
                
                message = data['choices'][0]['message']
                content = message.get('content')
                
                if content is None or (isinstance(content, str) and len(content.strip()) == 0):
                    print(f"Warning: Empty content from {model}")
                    return None
                
                return {
                    'content': content,
                    'reasoning_details': message.get('reasoning_details')
                }
        
        except Exception as e:
            print(f"Error querying model {model}: {e}")
            return None
    
    async def list_available_models(self) -> List[str]:
        """List available OpenRouter models (returns default set)."""
        # OpenRouter has many models, return a curated list
        return [
            "openai/gpt-4o",
            "openai/gpt-4-turbo",
            "openai/gpt-3.5-turbo",
            "anthropic/claude-3.5-sonnet",
            "anthropic/claude-3-opus",
            "google/gemini-pro",
            "google/gemini-pro-vision",
            "meta-llama/llama-3-70b-instruct",
            "mistralai/mistral-large",
        ]
    
    async def is_available(self) -> bool:
        """Check if OpenRouter is available (has API key)."""
        return self.api_key is not None and len(self.api_key) > 0


class OllamaProvider(LLMProvider):
    """Ollama local provider."""
    
    def __init__(self, api_url: str = "http://localhost:11434"):
        self.api_url = api_url
        self.chat_endpoint = f"{api_url}/api/chat"
        self.tags_endpoint = f"{api_url}/api/tags"
    
    async def query_model(
        self,
        model: str,
        messages: List[Dict[str, str]],
        timeout: float = 120.0
    ) -> Optional[Dict[str, Any]]:
        """Query Ollama API."""
        payload = {
            "model": model,
            "messages": messages,
            "stream": False
        }
        
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(self.chat_endpoint, json=payload)
                response.raise_for_status()
                
                data = response.json()
                message = data.get('message', {})
                content = message.get('content')
                
                if content is None or (isinstance(content, str) and len(content.strip()) == 0):
                    print(f"Warning: Empty content from {model}")
                    return None
                
                return {
                    'content': content,
                    'reasoning_details': None  # Ollama doesn't provide this
                }
        
        except httpx.ConnectError:
            print(f"Cannot connect to Ollama at {self.api_url}. Is Ollama running?")
            return None
        except Exception as e:
            print(f"Error querying model {model}: {e}")
            return None
    
    async def list_available_models(self) -> List[str]:
        """List models available in Ollama."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(self.tags_endpoint)
                response.raise_for_status()
                data = response.json()
                return [model['name'] for model in data.get('models', [])]
        except Exception as e:
            print(f"Error listing Ollama models: {e}")
            return []
    
    async def is_available(self) -> bool:
        """Check if Ollama service is available."""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(self.tags_endpoint)
                return response.status_code == 200
        except Exception:
            return False


# Global provider instance (set dynamically)
_current_provider: Optional[LLMProvider] = None


def get_provider() -> LLMProvider:
    """Get the current provider instance."""
    if _current_provider is None:
        raise RuntimeError("No provider configured. Call set_provider() first.")
    return _current_provider


def set_provider(provider: LLMProvider):
    """Set the current provider."""
    global _current_provider
    _current_provider = provider


async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """Query a model using the current provider."""
    provider = get_provider()
    return await provider.query_model(model, messages, timeout)


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """Query multiple models in parallel using the current provider."""
    import asyncio
    provider = get_provider()
    
    tasks = [provider.query_model(model, messages) for model in models]
    responses = await asyncio.gather(*tasks)
    
    return {model: response for model, response in zip(models, responses)}

