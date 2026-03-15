import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const messageImports = {
  en: () => import('../../messages/en.json'),
  fr: () => import('../../messages/fr.json'),
  de: () => import('../../messages/de.json'),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'fr' | 'de')) {
    locale = routing.defaultLocale;
  }

  const messages = (await messageImports[locale as keyof typeof messageImports]()).default;

  return {
    locale,
    messages,
  };
});
