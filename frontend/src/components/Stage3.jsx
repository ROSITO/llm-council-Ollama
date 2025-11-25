import ReactMarkdown from 'react-markdown';
import { useTranslation } from '../i18n/LanguageContext';
import './Stage3.css';

export default function Stage3({ finalResponse }) {
  const { t } = useTranslation();
  
  if (!finalResponse) {
    return null;
  }

  return (
    <div className="stage stage3">
      <h3 className="stage-title">{t('stage3Title')}</h3>
      <div className="final-response">
        <div className="chairman-label">
          {t('stage3Chairman')} {finalResponse.model.split('/')[1] || finalResponse.model}
        </div>
        <div className="final-text markdown-content">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
