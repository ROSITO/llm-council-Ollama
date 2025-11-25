import { createContext, useContext, useState, useEffect } from 'react';
import { translations, defaultLanguage } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Load from localStorage or use default
    const saved = localStorage.getItem('llm-council-language');
    return saved && translations[saved] ? saved : defaultLanguage;
  });

  useEffect(() => {
    // Save to localStorage when language changes
    localStorage.setItem('llm-council-language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations[defaultLanguage]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}

