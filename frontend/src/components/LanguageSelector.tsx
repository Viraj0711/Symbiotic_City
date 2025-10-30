import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, Language } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'gu' as Language, name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const handleLanguageSelect = (languageCode: Language) => {
    setLanguage(languageCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-gray-50"
        style={{color: '#000000'}}
        aria-label={t('header.language')}
      >
        <Globe className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">
          {getCurrentLanguage().flag} {getCurrentLanguage().name}
        </span>
        <span className="text-sm font-medium sm:hidden">
          {getCurrentLanguage().flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language.code)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3 ${
                currentLanguage === language.code
                  ? 'bg-green-50 text-green-600 font-medium'
                  : ''
              }`}
              style={{color: currentLanguage === language.code ? undefined : '#000000'}}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
              {currentLanguage === language.code && (
                <span className="ml-auto text-green-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;