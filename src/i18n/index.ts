import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/i18n/locales/en.json';
import kk from '@/i18n/locales/kk.json';
import ru from '@/i18n/locales/ru.json';

export const supportedLngs = ['en', 'ru', 'kk'] as const;
export type SupportedLng = (typeof supportedLngs)[number];

/** Labels shown in the switcher, in each language's own script. */
export const languageNames: Record<SupportedLng, string> = {
  en: 'EN',
  ru: 'РУС',
  kk: 'ҚАЗ',
};

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  kk: { translation: kk },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: [...supportedLngs],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
