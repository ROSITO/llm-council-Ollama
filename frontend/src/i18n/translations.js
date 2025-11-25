export const translations = {
  en: {
    // App
    appTitle: "LLM Council",
    newConversation: "New Conversation",
    configuration: "Configuration",
    close: "Close",
    
    // Chat
    startConversation: "Start a conversation",
    askQuestion: "Ask a question to consult the LLM Council",
    askPlaceholder: "Ask your question... (Shift+Enter for new line, Enter to send)",
    send: "Send",
    you: "You",
    consultingCouncil: "Consulting the council...",
    
    // Stages
    stage1Title: "Stage 1: Individual Responses",
    stage2Title: "Stage 2: Peer Rankings",
    stage2Description: "Each model evaluated all responses (anonymized as Response A, B, C, etc.) and provided rankings. Below, model names are shown in bold for readability, but the original evaluation used anonymous labels.",
    stage2RawEvaluations: "Raw Evaluations",
    stage2AggregateRankings: "Aggregate Rankings (Street Cred)",
    stage2AggregateDescription: "Combined results across all peer evaluations (lower score is better):",
    stage2ExtractedRanking: "Extracted Ranking:",
    stage2_5Title: "Stage 2.5: Debate",
    stage2_5Description: "The models engage in a structured debate, responding to each other's arguments and refining their positions.",
    stage2_5Round: "Round",
    stage3Title: "Stage 3: Final Council Answer",
    stage3Chairman: "Chairman:",
    
    // Loading states
    loadingStage1: "Running Stage 1: Collecting individual responses...",
    loadingStage2: "Running Stage 2: Peer rankings...",
    loadingStage2_5: "Running Stage 2.5: Debate...",
    loadingStage3: "Running Stage 3: Final synthesis...",
    
    // Configuration
    configTitle: "Council Configuration",
    configProvider: "Provider:",
    configProviderOllama: "Ollama (Local)",
    configProviderOpenRouter: "OpenRouter (Cloud)",
    configProviderAuto: "Auto-detect",
    configAvailableModels: "Available Models",
    configRefresh: "🔄 Refresh",
    configLoadingModels: "Loading models...",
    configNoModels: "No models available. Make sure Ollama is running or OpenRouter API key is configured.",
    configNumberModels: "Number of Models to Use:",
    configWillUse: "Will use all",
    configWillSelect: "Will randomly select",
    configFromSelected: "from",
    configSelectedModels: "selected models",
    configChairmanRandom: "Select Chairman randomly from models",
    configChairmanFirst: "First model will be used as Chairman",
    configApply: "Apply Configuration",
    configApplying: "Applying...",
    configSelected: "Selected:",
    configError: "Failed to load models:",
    configSuccess: "Configuration applied successfully",
    
    // Sidebar
    noConversations: "No conversations yet",
    messages: "messages",
  },
  
  fr: {
    // App
    appTitle: "Conseil LLM",
    newConversation: "Nouvelle Conversation",
    configuration: "Configuration",
    close: "Fermer",
    
    // Chat
    startConversation: "Démarrer une conversation",
    askQuestion: "Posez une question pour consulter le Conseil LLM",
    askPlaceholder: "Posez votre question... (Shift+Entrée pour nouvelle ligne, Entrée pour envoyer)",
    send: "Envoyer",
    you: "Vous",
    consultingCouncil: "Consultation du conseil...",
    
    // Stages
    stage1Title: "Étape 1 : Réponses Individuelles",
    stage2Title: "Étape 2 : Classements par les Pairs",
    stage2Description: "Chaque modèle a évalué toutes les réponses (anonymisées comme Réponse A, B, C, etc.) et a fourni des classements. Ci-dessous, les noms des modèles sont affichés en gras pour la lisibilité, mais l'évaluation originale utilisait des étiquettes anonymes.",
    stage2RawEvaluations: "Évaluations Brutes",
    stage2AggregateRankings: "Classements Agrégés (Crédibilité)",
    stage2AggregateDescription: "Résultats combinés de toutes les évaluations par les pairs (score plus bas = meilleur) :",
    stage2ExtractedRanking: "Classement Extraît :",
    stage2_5Title: "Étape 2.5 : Débat",
    stage2_5Description: "Les modèles s'engagent dans un débat structuré, répondant aux arguments des autres et affinant leurs positions.",
    stage2_5Round: "Tour",
    stage3Title: "Étape 3 : Réponse Finale du Conseil",
    stage3Chairman: "Président :",
    
    // Loading states
    loadingStage1: "Exécution de l'étape 1 : Collecte des réponses individuelles...",
    loadingStage2: "Exécution de l'étape 2 : Classements par les pairs...",
    loadingStage2_5: "Exécution de l'étape 2.5 : Débat...",
    loadingStage3: "Exécution de l'étape 3 : Synthèse finale...",
    
    // Configuration
    configTitle: "Configuration du Conseil",
    configProvider: "Fournisseur :",
    configProviderOllama: "Ollama (Local)",
    configProviderOpenRouter: "OpenRouter (Cloud)",
    configProviderAuto: "Détection automatique",
    configAvailableModels: "Modèles Disponibles",
    configRefresh: "🔄 Actualiser",
    configLoadingModels: "Chargement des modèles...",
    configNoModels: "Aucun modèle disponible. Assurez-vous qu'Ollama est en cours d'exécution ou que la clé API OpenRouter est configurée.",
    configNumberModels: "Nombre de Modèles à Utiliser :",
    configWillUse: "Utilisera tous les",
    configWillSelect: "Sélectionnera aléatoirement",
    configFromSelected: "parmi les",
    configSelectedModels: "modèles sélectionnés",
    configChairmanRandom: "Sélectionner le Président aléatoirement parmi les modèles",
    configChairmanFirst: "Le premier modèle sera utilisé comme Président",
    configApply: "Appliquer la Configuration",
    configApplying: "Application...",
    configSelected: "Sélectionné :",
    configError: "Échec du chargement des modèles :",
    configSuccess: "Configuration appliquée avec succès",
    
    // Sidebar
    noConversations: "Aucune conversation pour le moment",
    messages: "messages",
  },
  
  es: {
    // App
    appTitle: "Consejo LLM",
    newConversation: "Nueva Conversación",
    configuration: "Configuración",
    close: "Cerrar",
    
    // Chat
    startConversation: "Iniciar una conversación",
    askQuestion: "Haz una pregunta para consultar al Consejo LLM",
    askPlaceholder: "Haz tu pregunta... (Shift+Enter para nueva línea, Enter para enviar)",
    send: "Enviar",
    you: "Tú",
    consultingCouncil: "Consultando al consejo...",
    
    // Stages
    stage1Title: "Etapa 1: Respuestas Individuales",
    stage2Title: "Etapa 2: Clasificaciones por Pares",
    stage2Description: "Cada modelo evaluó todas las respuestas (anonimizadas como Respuesta A, B, C, etc.) y proporcionó clasificaciones. A continuación, los nombres de los modelos se muestran en negrita para legibilidad, pero la evaluación original usó etiquetas anónimas.",
    stage2RawEvaluations: "Evaluaciones en Bruto",
    stage2AggregateRankings: "Clasificaciones Agregadas (Crédito)",
    stage2AggregateDescription: "Resultados combinados de todas las evaluaciones por pares (puntuación más baja = mejor):",
    stage2ExtractedRanking: "Clasificación Extraída:",
    stage2_5Title: "Etapa 2.5: Debate",
    stage2_5Description: "Los modelos participan en un debate estructurado, respondiendo a los argumentos de los demás y refinando sus posiciones.",
    stage2_5Round: "Ronda",
    stage3Title: "Etapa 3: Respuesta Final del Consejo",
    stage3Chairman: "Presidente:",
    
    // Loading states
    loadingStage1: "Ejecutando Etapa 1: Recopilando respuestas individuales...",
    loadingStage2: "Ejecutando Etapa 2: Clasificaciones por pares...",
    loadingStage2_5: "Ejecutando Etapa 2.5: Debate...",
    loadingStage3: "Ejecutando Etapa 3: Síntesis final...",
    
    // Configuration
    configTitle: "Configuración del Consejo",
    configProvider: "Proveedor:",
    configProviderOllama: "Ollama (Local)",
    configProviderOpenRouter: "OpenRouter (Nube)",
    configProviderAuto: "Detección automática",
    configAvailableModels: "Modelos Disponibles",
    configRefresh: "🔄 Actualizar",
    configLoadingModels: "Cargando modelos...",
    configNoModels: "No hay modelos disponibles. Asegúrate de que Ollama esté en ejecución o que la clave API de OpenRouter esté configurada.",
    configNumberModels: "Número de Modelos a Usar:",
    configWillUse: "Usará todos los",
    configWillSelect: "Seleccionará aleatoriamente",
    configFromSelected: "de los",
    configSelectedModels: "modelos seleccionados",
    configChairmanRandom: "Seleccionar Presidente aleatoriamente de los modelos",
    configChairmanFirst: "El primer modelo se usará como Presidente",
    configApply: "Aplicar Configuración",
    configApplying: "Aplicando...",
    configSelected: "Seleccionado:",
    configError: "Error al cargar modelos:",
    configSuccess: "Configuración aplicada exitosamente",
    
    // Sidebar
    noConversations: "Aún no hay conversaciones",
    messages: "mensajes",
  },
  
  de: {
    // App
    appTitle: "LLM-Rat",
    newConversation: "Neue Unterhaltung",
    configuration: "Konfiguration",
    close: "Schließen",
    
    // Chat
    startConversation: "Eine Unterhaltung beginnen",
    askQuestion: "Stellen Sie eine Frage, um den LLM-Rat zu konsultieren",
    askPlaceholder: "Stellen Sie Ihre Frage... (Shift+Enter für neue Zeile, Enter zum Senden)",
    send: "Senden",
    you: "Sie",
    consultingCouncil: "Rat wird konsultiert...",
    
    // Stages
    stage1Title: "Stufe 1: Individuelle Antworten",
    stage2Title: "Stufe 2: Peer-Bewertungen",
    stage2Description: "Jedes Modell bewertete alle Antworten (anonymisiert als Antwort A, B, C usw.) und lieferte Bewertungen. Unten sind Modellnamen zur Lesbarkeit fett dargestellt, aber die ursprüngliche Bewertung verwendete anonyme Labels.",
    stage2RawEvaluations: "Rohe Bewertungen",
    stage2AggregateRankings: "Aggregierte Bewertungen (Glaubwürdigkeit)",
    stage2AggregateDescription: "Kombinierte Ergebnisse aller Peer-Bewertungen (niedrigere Punktzahl = besser):",
    stage2ExtractedRanking: "Extrahierte Bewertung:",
    stage2_5Title: "Stufe 2.5: Debatte",
    stage2_5Description: "Die Modelle führen eine strukturierte Debatte, reagieren auf die Argumente der anderen und verfeinern ihre Positionen.",
    stage2_5Round: "Runde",
    stage3Title: "Stufe 3: Finale Rat-Antwort",
    stage3Chairman: "Vorsitzender:",
    
    // Loading states
    loadingStage1: "Stufe 1 wird ausgeführt: Sammeln individueller Antworten...",
    loadingStage2: "Stufe 2 wird ausgeführt: Peer-Bewertungen...",
    loadingStage2_5: "Stufe 2.5 wird ausgeführt: Debatte...",
    loadingStage3: "Stufe 3 wird ausgeführt: Finale Synthese...",
    
    // Configuration
    configTitle: "Rat-Konfiguration",
    configProvider: "Anbieter:",
    configProviderOllama: "Ollama (Lokal)",
    configProviderOpenRouter: "OpenRouter (Cloud)",
    configProviderAuto: "Auto-Erkennung",
    configAvailableModels: "Verfügbare Modelle",
    configRefresh: "🔄 Aktualisieren",
    configLoadingModels: "Modelle werden geladen...",
    configNoModels: "Keine Modelle verfügbar. Stellen Sie sicher, dass Ollama läuft oder der OpenRouter API-Schlüssel konfiguriert ist.",
    configNumberModels: "Anzahl der zu verwendenden Modelle:",
    configWillUse: "Verwendet alle",
    configWillSelect: "Wählt zufällig",
    configFromSelected: "aus den",
    configSelectedModels: "ausgewählten Modellen",
    configChairmanRandom: "Vorsitzenden zufällig aus Modellen auswählen",
    configChairmanFirst: "Das erste Modell wird als Vorsitzender verwendet",
    configApply: "Konfiguration Anwenden",
    configApplying: "Wird angewendet...",
    configSelected: "Ausgewählt:",
    configError: "Fehler beim Laden der Modelle:",
    configSuccess: "Konfiguration erfolgreich angewendet",
    
    // Sidebar
    noConversations: "Noch keine Unterhaltungen",
    messages: "Nachrichten",
  },
};

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const defaultLanguage = 'en';

