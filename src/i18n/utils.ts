import { defaultLocale, languages, translations, type SupportedLocale } from './ui';

export function getLocaleFromUrl(url: URL): SupportedLocale {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in languages) {
    return lang as SupportedLocale;
  }
  return defaultLocale;
}

export function useTranslations(lang: SupportedLocale) {
  return function t<K extends keyof typeof translations[typeof defaultLocale]>(
    key: K
  ): typeof translations[typeof defaultLocale][K] {
    const langDict = translations[lang] || translations[defaultLocale];
    return (langDict[key] ?? translations[defaultLocale][key]) as any;
  };
}

export function getLocalizedPath(subpath: string, targetLocale: SupportedLocale): string {
  // Normalize subpath to start with /
  let cleanPath = subpath;
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

  // Remove existing locale prefix if any
  for (const loc of Object.keys(languages)) {
    if (cleanPath.startsWith(`/${loc}/`)) {
      cleanPath = cleanPath.slice(loc.length + 1);
      break;
    } else if (cleanPath === `/${loc}`) {
      cleanPath = '/';
      break;
    }
  }

  // Ensure trailing slash
  if (!cleanPath.endsWith('/')) {
    cleanPath += '/';
  }

  if (targetLocale === defaultLocale) {
    return cleanPath;
  }

  return `/${targetLocale}${cleanPath}`;
}
