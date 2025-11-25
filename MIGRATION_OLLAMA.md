# Guide de Migration : OpenRouter → Ollama

## Vue d'ensemble

Ce guide détaille les changements nécessaires pour migrer LLM Council d'OpenRouter (API cloud) vers Ollama (modèles locaux).

## Différences principales

### OpenRouter
- API cloud avec authentification par clé
- URL: `https://openrouter.ai/api/v1/chat/completions`
- Format: OpenAI-compatible (OpenAI API format)
- Modèles: `openai/gpt-5.1`, `anthropic/claude-sonnet-4.5`, etc.
- Coût: Pay-per-use

### Ollama
- API locale (pas d'authentification)
- URL: `http://localhost:11434/api/chat`
- Format: Ollama API format (légèrement différent)
- Modèles: `llama3`, `mistral`, `codellama`, etc. (noms simples)
- Coût: Gratuit (mais nécessite ressources locales)

## Architecture actuelle

```
backend/
├── openrouter.py      # Client API OpenRouter
├── config.py          # Configuration (API key, modèles)
├── council.py         # Logique métier (utilise openrouter)
└── main.py            # API FastAPI
```

## Changements nécessaires

### 1. Nouveau fichier: `backend/ollama.py`

**Complexité**: ⭐⭐ (Moyenne)

Créer un nouveau client Ollama similaire à `openrouter.py` mais avec:
- URL: `http://localhost:11434/api/chat`
- Format de requête Ollama (voir ci-dessous)
- Pas d'authentification
- Gestion des erreurs spécifiques à Ollama

**Format de requête Ollama:**
```python
{
    "model": "llama3",
    "messages": [
        {"role": "user", "content": "..."}
    ],
    "stream": False  # ou True pour streaming
}
```

**Format de réponse Ollama:**
```python
{
    "message": {
        "role": "assistant",
        "content": "..."
    },
    "done": True
}
```

**Différences clés:**
- Pas de `choices[0].message`, directement `message`
- Pas de `reasoning_details`
- Structure de réponse plus simple

### 2. Modification: `backend/config.py`

**Complexité**: ⭐ (Faible)

Changements:
- Supprimer `OPENROUTER_API_KEY`
- Supprimer `OPENROUTER_API_URL`
- Ajouter `OLLAMA_API_URL = "http://localhost:11434/api/chat"`
- Changer les noms de modèles:
  ```python
  COUNCIL_MODELS = [
      "llama3",           # au lieu de "openai/gpt-5.1"
      "mistral",          # au lieu de "google/gemini-3-pro-preview"
      "codellama",        # au lieu de "anthropic/claude-sonnet-4.5"
      "neural-chat",      # au lieu de "x-ai/grok-4"
  ]
  CHAIRMAN_MODEL = "llama3"  # ou autre modèle local
  ```

### 3. Modification: `backend/council.py`

**Complexité**: ⭐ (Faible)

Changement d'import:
```python
# Avant
from .openrouter import query_models_parallel, query_model

# Après
from .ollama import query_models_parallel, query_model
```

**Note**: Si l'interface des fonctions reste identique, aucun autre changement nécessaire.

### 4. Modification: `backend/main.py`

**Complexité**: ⭐ (Faible)

Aucun changement nécessaire si l'interface de `query_model` reste identique.

### 5. Modification: `.env`

**Complexité**: ⭐ (Très faible)

Supprimer:
```
OPENROUTER_API_KEY=sk-or-v1-...
```

Ajouter (optionnel, pour personnaliser l'URL):
```
OLLAMA_API_URL=http://localhost:11434/api/chat
```

### 6. Modification: `pyproject.toml`

**Complexité**: ⭐ (Très faible)

Aucun changement nécessaire. `httpx` est déjà dans les dépendances.

### 7. Documentation: `README.md`

**Complexité**: ⭐ (Très faible)

Mettre à jour:
- Section "Setup" pour mentionner Ollama
- Instructions d'installation d'Ollama
- Configuration des modèles locaux

## Points d'attention

### 1. Performance
- **OpenRouter**: Rapide (serveurs cloud)
- **Ollama**: Dépend de la machine locale (CPU/GPU)
- **Impact**: Les requêtes peuvent être plus lentes, surtout avec plusieurs modèles en parallèle

### 2. Disponibilité des modèles
- **OpenRouter**: Accès à tous les modèles cloud
- **Ollama**: Seulement les modèles téléchargés localement
- **Impact**: Besoin de télécharger les modèles avant utilisation

### 3. Gestion des erreurs
- **OpenRouter**: Erreurs HTTP standard
- **Ollama**: Peut être indisponible si le service n'est pas démarré
- **Impact**: Ajouter une vérification de disponibilité au démarrage

### 4. Streaming
- **OpenRouter**: Supporte le streaming
- **Ollama**: Supporte aussi le streaming
- **Impact**: Peut être amélioré pour un meilleur UX

### 5. Taille des modèles
- **OpenRouter**: Pas de limite (cloud)
- **Ollama**: Limité par la RAM/VRAM locale
- **Impact**: Choisir des modèles adaptés à la machine

## Modèles Ollama recommandés

Pour un "council" équilibré:

1. **llama3** (8B ou 70B) - Généraliste, bon équilibre
2. **mistral** (7B) - Rapide et efficace
3. **codellama** (13B) - Spécialisé code/technique
4. **neural-chat** (7B) - Bon pour les conversations
5. **phi-2** (2.7B) - Très léger, rapide

**Chairman**: Utiliser `llama3:70b` si disponible, sinon `llama3:8b`

## Vérification de compatibilité

### Interface attendue

Les fonctions doivent respecter cette interface:

```python
async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Optional[Dict[str, Any]]:
    """
    Returns: {'content': str, 'reasoning_details': Optional[str]}
    """

async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Returns: {model: response_dict or None}
    """
```

Si cette interface est respectée, le reste du code fonctionnera sans modification.

## Tests à effectuer

1. ✅ Vérifier qu'Ollama est démarré: `curl http://localhost:11434/api/tags`
2. ✅ Tester un appel simple avec un modèle
3. ✅ Tester les appels parallèles (stage 1)
4. ✅ Tester les prompts longs (stage 2, 2.5, 3)
5. ✅ Vérifier la gestion des erreurs (modèle indisponible)
6. ✅ Vérifier les timeouts
7. ✅ Tester avec différents modèles

## Estimation de temps

- **Développement**: 2-4 heures
- **Tests**: 1-2 heures
- **Documentation**: 30 minutes
- **Total**: 3.5-6.5 heures

## Risques

1. **Risque faible**: Performance dégradée sur machines peu puissantes
2. **Risque moyen**: Modèles locaux peuvent avoir des limitations (taille de contexte, qualité)
3. **Risque faible**: Besoin de gérer le démarrage/arrêt d'Ollama

## Avantages de la migration

✅ **Gratuit**: Pas de coût par requête
✅ **Privé**: Données restent locales
✅ **Contrôle**: Choix des modèles et versions
✅ **Offline**: Fonctionne sans internet
✅ **Personnalisable**: Peut fine-tuner les modèles

## Inconvénients

❌ **Ressources**: Nécessite RAM/GPU
❌ **Performance**: Peut être plus lent
❌ **Maintenance**: Gérer les mises à jour de modèles
❌ **Qualité**: Modèles locaux peuvent être moins performants que les cloud

