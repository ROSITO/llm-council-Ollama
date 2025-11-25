import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from '../i18n/LanguageContext';
import './Stage2_5.css';

export default function Stage2_5({ debateRounds }) {
  const { t } = useTranslation();
  const [activeRound, setActiveRound] = useState(0);

  if (!debateRounds || debateRounds.length === 0) {
    return null;
  }

  return (
    <div className="stage stage2-5">
      <h3 className="stage-title">{t('stage2_5Title')}</h3>
      
      <p className="stage-description">
        {t('stage2_5Description')}
      </p>

      {/* Round selector tabs */}
      <div className="round-tabs">
        {debateRounds.map((round, index) => (
          <button
            key={index}
            className={`round-tab ${activeRound === index ? 'active' : ''}`}
            onClick={() => setActiveRound(index)}
          >
            {t('stage2_5Round')} {round.tour}
          </button>
        ))}
      </div>

      {/* Active round content */}
      <div className="debate-round">
        <h4 className="round-title">{t('stage2_5Round')} {debateRounds[activeRound].tour}</h4>
        
        <div className="debate-responses">
          {debateRounds[activeRound].responses.map((response, index) => (
            <div key={index} className="debate-response">
              <div className="debate-model-name">
                {response.model.split('/')[1] || response.model}
              </div>
              <div className="debate-content markdown-content">
                <ReactMarkdown>{response.response}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

