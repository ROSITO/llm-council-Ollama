import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onShowConfig,
}) {
  const { t } = useTranslation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>{t('appTitle')}</h1>
        <button className="new-conversation-btn" onClick={onNewConversation}>
          + {t('newConversation')}
        </button>
        {onShowConfig && (
          <button className="config-btn" onClick={onShowConfig}>
            ⚙️ {t('configuration')}
          </button>
        )}
      </div>

      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">{t('noConversations')}</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                conv.id === currentConversationId ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-title">
                {conv.title || t('newConversation')}
              </div>
              <div className="conversation-meta">
                {conv.message_count} {t('messages')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
