import i18next from 'i18next';
import ru from './locales/ru.json';
import en from './locales/en.json';
import { ReactNode, useEffect, useState } from 'react';
import { useStore } from '../store';

export type TLanguage = 'ru' | 'en';

i18next.init({
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
  resources: {
    ru: {
      translation: ru,
    },
    en: {
      translation: en,
    },
  },
});

export const translate = <D,>(
  key: string,
  options?: { [key: string]: any }
): D extends true ? ReactNode : string => {
  const result = i18next.t<string>(key, options);

  // @ts-ignore
  return new RegExp('<[^<>]+>').test(result) ? (
    <span dangerouslySetInnerHTML={{ __html: result }} />
  ) : (
    result
  );
};

export const useLanguage = () => {
  const [, setLng] = useState();
  const language = useStore((store) => store.language);

  useEffect(() => {
    i18next.changeLanguage(language);
    // Хак, чтобы вся страница перерендиривалась при смене языка
    setLng(language);
  }, [language]);
};
