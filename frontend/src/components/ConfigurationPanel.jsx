import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../api';
import './ConfigurationPanel.css';

export default function ConfigurationPanel({ onConfigChange }) {
  const { t } = useTranslation();
  const [provider, setProvider] = useState('auto');
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [numModels, setNumModels] = useState(4);
  const [chairmanRandom, setChairmanRandom] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load models when provider changes
  useEffect(() => {
    loadModels();
  }, [provider]);

  const loadModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listModels(provider);
      setAvailableModels(data.models || []);
      if (data.models && data.models.length > 0) {
        // Pre-select first models up to numModels
        const preSelected = data.models.slice(0, Math.min(numModels, data.models.length));
        setSelectedModels(preSelected);
      }
    } catch (err) {
      setError(`Failed to load models: ${err.message}`);
      setAvailableModels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModelToggle = (model) => {
    setSelectedModels((prev) => {
      if (prev.includes(model)) {
        return prev.filter((m) => m !== model);
      } else {
        return [...prev, model];
      }
    });
  };

  const handleApply = async () => {
    if (selectedModels.length === 0) {
      setError(t('configError') + ' Please select at least one model');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await api.setConfig(provider, selectedModels, numModels, chairmanRandom);
      setSuccess(result.message || t('configSuccess'));
      if (onConfigChange) {
        onConfigChange(result.config);
      }
    } catch (err) {
      setError(`${t('configError')} ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="configuration-panel">
      <h3>{t('configTitle')}</h3>

      {/* Provider Selection */}
      <div className="config-section">
        <label>{t('configProvider')}</label>
        <div className="provider-buttons">
          <button
            className={provider === 'ollama' ? 'active' : ''}
            onClick={() => setProvider('ollama')}
            disabled={loading}
          >
            {t('configProviderOllama')}
          </button>
          <button
            className={provider === 'openrouter' ? 'active' : ''}
            onClick={() => setProvider('openrouter')}
            disabled={loading}
          >
            {t('configProviderOpenRouter')}
          </button>
          <button
            className={provider === 'auto' ? 'active' : ''}
            onClick={() => setProvider('auto')}
            disabled={loading}
          >
            {t('configProviderAuto')}
          </button>
        </div>
      </div>

      {/* Available Models */}
      <div className="config-section">
        <label>
          {t('configAvailableModels')} ({availableModels.length}):
          <button onClick={loadModels} disabled={loading} className="refresh-btn">
            {t('configRefresh')}
          </button>
        </label>
        {loading && <div className="loading">{t('configLoadingModels')}</div>}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        {availableModels.length > 0 && (
          <div className="models-list">
            {availableModels.map((model) => (
              <label key={model} className="model-checkbox">
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model)}
                  onChange={() => handleModelToggle(model)}
                  disabled={loading}
                />
                <span>{model}</span>
              </label>
            ))}
          </div>
        )}
        {!loading && availableModels.length === 0 && (
          <div className="no-models">
            {t('configNoModels')}
          </div>
        )}
      </div>

      {/* Number of Models */}
      <div className="config-section">
        <label>
          {t('configNumberModels')}
          <input
            type="number"
            min="1"
            max={selectedModels.length || availableModels.length}
            value={numModels}
            onChange={(e) => setNumModels(parseInt(e.target.value) || 1)}
            disabled={loading}
          />
        </label>
        <div className="help-text">
          {selectedModels.length > numModels
            ? `${t('configWillSelect')} ${numModels} ${t('configFromSelected')} ${selectedModels.length} ${t('configSelectedModels')}`
            : `${t('configWillUse')} ${selectedModels.length} ${t('configSelectedModels')}`}
        </div>
      </div>

      {/* Chairman Selection */}
      <div className="config-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={chairmanRandom}
            onChange={(e) => setChairmanRandom(e.target.checked)}
            disabled={loading}
          />
          <span>{t('configChairmanRandom')}</span>
        </label>
        {!chairmanRandom && (
          <div className="help-text">{t('configChairmanFirst')}</div>
        )}
      </div>

      {/* Apply Button */}
      <div className="config-actions">
        <button
          onClick={handleApply}
          disabled={loading || selectedModels.length === 0}
          className="apply-btn"
        >
          {loading ? t('configApplying') : t('configApply')}
        </button>
      </div>

      {/* Current Selection Summary */}
      {selectedModels.length > 0 && (
        <div className="selection-summary">
          <strong>{t('configSelected')}</strong> {selectedModels.join(', ')}
        </div>
      )}
    </div>
  );
}

