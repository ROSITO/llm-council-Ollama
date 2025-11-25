# Roadmap: Migration vers Ollama

## Phase 1: Préparation (30 min)

### 1.1 Installation d'Ollama
- [ ] Installer Ollama: https://ollama.ai
- [ ] Vérifier l'installation: `ollama --version`
- [ ] Démarrer le service Ollama

### 1.2 Téléchargement des modèles
- [ ] Télécharger les modèles choisis:
  ```bash
  ollama pull llama3
  ollama pull mistral
  ollama pull codellama
  ollama pull neural-chat
  ```
- [ ] Vérifier la liste: `ollama list`
- [ ] Tester un modèle: `ollama run llama3 "Hello"`

### 1.3 Vérification de l'API
- [ ] Tester l'API: `curl http://localhost:11434/api/tags`
- [ ] Tester un appel chat: 
  ```bash
  curl http://localhost:11434/api/chat -d '{
    "model": "llama3",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
  ```

## Phase 2: Développement (2-3 heures)

### 2.1 Création du client Ollama
- [ ] Créer `backend/ollama.py`
- [ ] Implémenter `query_model()` avec format Ollama
- [ ] Implémenter `query_models_parallel()`
- [ ] Gérer les erreurs spécifiques (service non démarré, modèle inexistant)
- [ ] Ajouter logging approprié

**Checklist technique:**
- [ ] URL: `http://localhost:11434/api/chat`
- [ ] Format requête: `{"model": str, "messages": List[Dict], "stream": False}`
- [ ] Format réponse: Extraire `message.content`
- [ ] Gestion timeout
- [ ] Gestion erreurs HTTP
- [ ] Interface identique à `openrouter.py`

### 2.2 Modification de la configuration
- [ ] Modifier `backend/config.py`:
  - [ ] Supprimer `OPENROUTER_API_KEY`
  - [ ] Supprimer `OPENROUTER_API_URL`
  - [ ] Ajouter `OLLAMA_API_URL`
  - [ ] Mettre à jour `COUNCIL_MODELS` avec noms Ollama
  - [ ] Mettre à jour `CHAIRMAN_MODEL`
- [ ] Mettre à jour `.env` (supprimer clé API)

### 2.3 Mise à jour des imports
- [ ] Modifier `backend/council.py`: changer import `openrouter` → `ollama`
- [ ] Vérifier qu'aucun autre fichier n'importe `openrouter`

### 2.4 Gestion de la disponibilité
- [ ] Ajouter fonction `check_ollama_available()` dans `ollama.py`
- [ ] Appeler au démarrage du backend (optionnel, avec warning si indisponible)

## Phase 3: Tests (1-2 heures)

### 3.1 Tests unitaires
- [ ] Tester `query_model()` avec un modèle valide
- [ ] Tester `query_model()` avec un modèle inexistant
- [ ] Tester `query_model()` avec Ollama non démarré
- [ ] Tester `query_models_parallel()` avec plusieurs modèles
- [ ] Tester avec des prompts longs

### 3.2 Tests d'intégration
- [ ] Tester Stage 1 (réponses individuelles)
- [ ] Tester Stage 2 (rankings)
- [ ] Tester Stage 2.5 (débat)
- [ ] Tester Stage 3 (synthèse)
- [ ] Tester le flux complet end-to-end

### 3.3 Tests de performance
- [ ] Mesurer le temps de réponse (comparer avec OpenRouter si possible)
- [ ] Tester avec différents modèles
- [ ] Vérifier la consommation mémoire

### 3.4 Tests d'erreurs
- [ ] Modèle non disponible
- [ ] Ollama non démarré
- [ ] Timeout
- [ ] Réponse vide
- [ ] Erreur réseau

## Phase 4: Documentation (30 min)

### 4.1 Mise à jour README
- [ ] Section "Setup" - instructions Ollama
- [ ] Section "Configuration" - nouveaux noms de modèles
- [ ] Section "Requirements" - ressources système recommandées
- [ ] Section "Troubleshooting" - problèmes courants Ollama

### 4.2 Documentation technique
- [ ] Commenter le code `ollama.py`
- [ ] Documenter les différences avec OpenRouter
- [ ] Ajouter exemples de configuration

## Phase 5: Optimisations (optionnel, 1-2 heures)

### 5.1 Performance
- [ ] Implémenter le streaming pour meilleur UX
- [ ] Cache des réponses (si pertinent)
- [ ] Pool de connexions HTTP

### 5.2 Fonctionnalités
- [ ] Détection automatique des modèles disponibles
- [ ] Fallback si un modèle n'est pas disponible
- [ ] Configuration dynamique des modèles via UI

### 5.3 Monitoring
- [ ] Logs de performance
- [ ] Métriques de temps de réponse
- [ ] Alertes si Ollama est indisponible

## Phase 6: Déploiement (30 min)

### 6.1 Préparation
- [ ] Vérifier que tous les modèles sont téléchargés
- [ ] Tester sur l'environnement cible
- [ ] Vérifier les ressources système

### 6.2 Migration
- [ ] Backup de la configuration actuelle
- [ ] Appliquer les changements
- [ ] Redémarrer le backend
- [ ] Vérifier que tout fonctionne

### 6.3 Rollback plan
- [ ] Garder `openrouter.py` en backup
- [ ] Documenter comment revenir en arrière
- [ ] Tester le rollback

## Timeline estimée

| Phase | Durée | Priorité |
|-------|-------|----------|
| Phase 1: Préparation | 30 min | 🔴 Critique |
| Phase 2: Développement | 2-3h | 🔴 Critique |
| Phase 3: Tests | 1-2h | 🔴 Critique |
| Phase 4: Documentation | 30 min | 🟡 Important |
| Phase 5: Optimisations | 1-2h | 🟢 Optionnel |
| Phase 6: Déploiement | 30 min | 🔴 Critique |
| **TOTAL** | **5.5-8.5h** | |

## Critères de succès

✅ Tous les stages fonctionnent avec Ollama
✅ Performance acceptable (< 2x plus lent qu'OpenRouter)
✅ Gestion d'erreurs robuste
✅ Documentation à jour
✅ Tests passent tous

## Risques et mitigation

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Performance trop lente | Moyenne | Élevé | Choisir modèles plus petits, optimiser |
| Modèles incompatibles | Faible | Moyen | Tester avant, avoir fallback |
| Ollama crash | Faible | Élevé | Gestion d'erreurs, redémarrage auto |
| RAM insuffisante | Moyenne | Élevé | Recommander modèles selon RAM |

## Notes importantes

1. **Compatibilité**: Garder l'interface identique permet un rollback facile
2. **Modèles**: Tester avec plusieurs modèles pour trouver le meilleur équilibre
3. **Performance**: Les modèles 7B-13B sont un bon compromis qualité/vitesse
4. **GPU**: Si disponible, utiliser GPU pour meilleures performances

## Prochaines étapes

1. Démarrer par la Phase 1 (installation Ollama)
2. Tester manuellement quelques appels API
3. Implémenter `ollama.py` en suivant l'interface existante
4. Tester progressivement chaque stage
5. Documenter les différences observées

