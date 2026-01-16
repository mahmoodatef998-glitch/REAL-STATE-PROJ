"use client";
import { useLanguage } from '../../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-neutral-800 rounded-lg p-1 border border-white/10">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-accent text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          language === 'ar'
            ? 'bg-accent text-white'
            : 'text-neutral-400 hover:text-white'
        }`}
      >
        🇸🇦 AR
      </button>
    </div>
  );
}

