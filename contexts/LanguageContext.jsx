"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    nav: {
      home: 'Home',
      properties: 'Properties',
      news: 'News',
      about: 'About',
      contact: 'Contact',
      dashboard: 'Dashboard',
      logout: 'Logout',
      join: 'Join Now',
      login: 'Login'
    },
    hero: {
      tag: 'Experience Excellence',
      title: 'FUTURE',
      titleLine2: 'OF LIVING.',
      subtitle: 'Redefining luxury through architectural precision and minimalist design. Exclusive properties in Ajman and across the Emirates.',
      cta: 'EXPLORE PROPERTIES',
      secondaryCta: 'OUR STORY',
      scroll: 'SCROLL'
    },
    admin: {
      portal: 'Management Portal',
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      users: 'User Management',
      properties: 'Active Properties',
      closed: 'Closed Properties',
      deals: 'Deals & Commissions'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      properties: 'العقارات',
      news: 'الأخبار',
      about: 'من نحن',
      contact: 'اتصل بنا',
      dashboard: 'لوحة التحكم',
      logout: 'خروج',
      join: 'انضم الآن',
      login: 'دخول'
    },
    hero: {
      tag: 'جرب التميز',
      title: 'مستقبل',
      titleLine2: 'الحياة.',
      subtitle: 'إعادة تعريف الرفاهية من خلال الدقة المعمارية والتصميم البسيط. عقارات حصرية في عجمان وجميع أنحاء الإمارات.',
      cta: 'استكشف العقارات',
      secondaryCta: 'قصتنا',
      scroll: 'اسحب للأسفل'
    },
    admin: {
      portal: 'بوابة الإدارة',
      dashboard: 'لوحة التحكم',
      analytics: 'التحليلات',
      users: 'إدارة الفريق',
      properties: 'العقارات النشطة',
      closed: 'العقارات المباعة',
      deals: 'الصفقات والعمولات'
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'en';
    setLang(saved);
    updateDirection(saved);
    setIsReady(true);
  }, []);

  const updateDirection = (language) => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    updateDirection(newLang);
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[lang];
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path;
      }
    }
    return result;
  };

  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
