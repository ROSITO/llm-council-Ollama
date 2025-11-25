# LLM Council (Enhanced Fork)

![llmcouncil](header.jpg)

This is an enhanced fork of the original [LLM Council](https://github.com/karpathy/llm-council) project. Instead of asking a question to a single LLM provider, you can group multiple LLMs into your "LLM Council". This repo is a local web app that looks like ChatGPT but uses multiple LLMs (via OpenRouter or Ollama) to provide collaborative answers through a structured deliberation process.

## 🆕 New Features in This Fork

### ✨ Phase de Débat (Debate Phase)
- **Stage 2.5: Structured Debate** - Models engage in multiple rounds of debate, responding to each other's arguments and refining their positions
- Interactive discussion between models before final synthesis
- Configurable number of debate rounds (default: 2)

### 🌍 Multilingual Support
- **4 Languages**: English 🇬🇧, Français 🇫🇷, Español 🇪🇸, Deutsch 🇩🇪
- Language selector with flags in the top-right corner
- All UI elements fully translated
- Language preference saved in localStorage

### 🔌 Dual Provider Support
- **OpenRouter** (Cloud) - Access to premium cloud models
- **Ollama** (Local) - Free, private, offline-capable local models
- **Auto-detect** - Automatically selects available provider
- Switch between providers on the fly via UI

### ⚙️ Dynamic Configuration
- **Model Selection** - Choose which models to use from available list
- **Flexible Council Size** - Select number of models (randomly chosen if more selected)
- **Random Chairman** - Chairman selected randomly from council models
- **Real-time Configuration** - Change settings without restarting

### 🎯 Enhanced User Experience
- Configuration panel with model selection
- Visual indicators for each stage
- Better error handling and fallbacks
- Improved UI/UX with modern design

## How It Works

When you submit a query, the system runs a **4-stage deliberation process**:

1. **Stage 1: First Opinions**. The user query is given to all selected LLMs individually, and the responses are collected. The individual responses are shown in a "tab view", so that the user can inspect them all one by one.

2. **Stage 2: Peer Review**. Each individual LLM is given the responses of the other LLMs. Under the hood, the LLM identities are anonymized so that the LLM can't play favorites when judging their outputs. The LLM is asked to rank them in accuracy and insight.

3. **Stage 2.5: Debate** (NEW). Models engage in structured debate rounds where they can:
   - Defend their initial positions
   - Respond to criticisms from evaluations
   - Refine their arguments based on discussion
   - React to points raised by other models

4. **Stage 3: Final Response**. The designated Chairman of the LLM Council (randomly selected or first model) takes all of the model's responses, evaluations, and debate discussions and compiles them into a single final answer that is presented to the user.

## Setup

### 1. Install Dependencies

The project uses [uv](https://docs.astral.sh/uv/) for Python backend and npm for frontend.

**Backend:**
```bash
uv sync
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 2. Configure API Keys

Create a `.env` file in the project root:

**For OpenRouter (Cloud):**
```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

Get your API key at [openrouter.ai](https://openrouter.ai/). Make sure to purchase the credits you need, or sign up for automatic top up.

**For Ollama (Local):**
```bash
# No API key needed!
# Just make sure Ollama is installed and running
```

Install Ollama from [ollama.ai](https://ollama.ai/) and download models:
```bash
ollama pull llama3
ollama pull mistral
# etc.
```

### 3. Configure Models (Optional)

You can configure models in two ways:

**Option A: Via UI (Recommended)**
1. Click "⚙️ Configuration" in the sidebar
2. Select provider (Ollama/OpenRouter/Auto)
3. Choose models from available list
4. Set number of models to use
5. Enable/disable random chairman selection
6. Click "Apply Configuration"

**Option B: Via Config File**
Edit `backend/config.py`:

```python
COUNCIL_MODELS = [
    "openai/gpt-4o",              # OpenRouter format
    "anthropic/claude-3.5-sonnet", # or
    "llama3",                      # Ollama format
    "mistral",
]

CHAIRMAN_MODEL = "llama3"  # or use random selection
```

## Running the Application

**Option 1: Use the start script**
```bash
./start.sh
```

**Option 2: Run manually**

Terminal 1 (Backend):
```bash
uv run python -m backend.main
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.

## Language Selection

Click the language selector (flag icon) in the top-right corner to switch between:
- 🇬🇧 English
- 🇫🇷 Français
- 🇪🇸 Español
- 🇩🇪 Deutsch

Your language preference is automatically saved.

## Configuration

### Using the Configuration Panel

1. Click "⚙️ Configuration" in the sidebar
2. **Select Provider**:
   - **Ollama (Local)**: Use local models (free, private, offline)
   - **OpenRouter (Cloud)**: Use cloud models (requires API key)
   - **Auto-detect**: Automatically uses available provider
3. **Select Models**: Check the models you want to use
4. **Set Number**: Choose how many models to actually use (randomly selected if more chosen)
5. **Chairman Selection**: Toggle random selection or use first model
6. Click "Apply Configuration"

### Provider Comparison

| Feature | OpenRouter | Ollama |
|---------|-----------|--------|
| **Cost** | Pay-per-use | Free |
| **Privacy** | Cloud (data sent to API) | Local (data stays on device) |
| **Internet** | Required | Optional (offline capable) |
| **Models** | Many premium models | Local models only |
| **Speed** | Fast (cloud servers) | Depends on hardware |
| **Setup** | API key needed | Install + download models |

## Tech Stack

- **Backend:** FastAPI (Python 3.10+), async httpx, OpenRouter API, Ollama API
- **Frontend:** React + Vite, react-markdown for rendering, i18n support
- **Storage:** JSON files in `data/conversations/`
- **Package Management:** uv for Python, npm for JavaScript
- **Providers:** OpenRouter (cloud), Ollama (local)

## Architecture

### Provider Abstraction

The system uses a provider abstraction layer (`backend/providers.py`) that supports:
- **OpenRouterProvider**: Cloud-based models via OpenRouter API
- **OllamaProvider**: Local models via Ollama API

Both providers implement the same interface, allowing seamless switching.

### Dynamic Configuration

- Configuration can be changed via UI without restarting
- Models are selected dynamically per request
- Chairman is selected randomly or from first model
- Settings persist during session

### Internationalization

- Translation system using React Context
- All UI strings externalized to translation files
- Language preference persisted in localStorage
- Easy to add new languages

## Differences from Original

This fork adds several enhancements:

1. ✅ **Debate Phase** - Models can debate before final synthesis
2. ✅ **Multilingual UI** - 4 languages supported
3. ✅ **Dual Provider Support** - OpenRouter + Ollama
4. ✅ **Dynamic Configuration** - UI-based model selection
5. ✅ **Random Chairman** - More diverse final answers
6. ✅ **Better Error Handling** - Fallbacks and recovery
7. ✅ **Enhanced UX** - Configuration panel, better feedback

## Troubleshooting

### Ollama Not Working
- Make sure Ollama is running: `ollama serve`
- Check models are downloaded: `ollama list`
- Verify API is accessible: `curl http://localhost:11434/api/tags`

### OpenRouter Not Working
- Verify API key in `.env` file
- Check you have credits/balance
- Ensure internet connection

### Models Not Appearing
- Click "🔄 Refresh" in configuration panel
- Check provider is available (Ollama running or OpenRouter key set)
- Verify models are downloaded (for Ollama)

### Language Not Changing
- Clear browser cache/localStorage
- Check browser console for errors
- Ensure LanguageProvider is properly initialized

## Contributing

This is a fork with enhancements. Feel free to:
- Add more languages (edit `frontend/src/i18n/translations.js`)
- Add more providers (implement `LLMProvider` interface)
- Improve debate prompts
- Enhance UI/UX

## License

Same as original project (check original repository for license details).

## Acknowledgments

- Original project by [Andrej Karpathy](https://github.com/karpathy/llm-council)
- Enhanced with debate phase, multilingual support, and dual provider architecture
