"""
Exemple de configuration pour Ollama.
À remplacer config.py par ce contenu une fois la migration effectuée.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Ollama API endpoint (par défaut: localhost:11434)
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/chat")

# Council members - list of Ollama model names
# Note: Ces modèles doivent être téléchargés avec 'ollama pull <model>'
COUNCIL_MODELS = [
    "llama3",           # Meta Llama 3 (8B ou 70B)
    "mistral",          # Mistral 7B
    "codellama",        # Code Llama (13B)
    "neural-chat",      # Neural Chat 7B
]

# Chairman model - synthesizes final response
# Utiliser un modèle plus puissant pour la synthèse finale
CHAIRMAN_MODEL = "llama3"  # ou "llama3:70b" si disponible

# Data directory for conversation storage
DATA_DIR = "data/conversations"

# Fonction utilitaire pour vérifier les modèles disponibles
async def verify_models_available():
    """
    Vérifie que tous les modèles configurés sont disponibles dans Ollama.
    Affiche un warning si un modèle n'est pas trouvé.
    """
    try:
        from .ollama import list_available_models
        available = await list_available_models()
        
        missing = []
        for model in COUNCIL_MODELS + [CHAIRMAN_MODEL]:
            # Ollama peut avoir des tags comme "llama3:8b", vérifier la base
            model_base = model.split(':')[0]
            if not any(m.startswith(model_base) for m in available):
                missing.append(model)
        
        if missing:
            print(f"⚠️  Warning: Modèles non disponibles: {missing}")
            print(f"   Modèles disponibles: {available}")
            print(f"   Utilisez 'ollama pull <model>' pour les télécharger")
        else:
            print(f"✅ Tous les modèles sont disponibles")
            
    except Exception as e:
        print(f"⚠️  Impossible de vérifier les modèles: {e}")

