import { tr } from './tr';
import { en } from './en';
import { Dictionary, Locale } from './types';

const dictionaries: Record<Locale, Dictionary> = {
  tr,
  en,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.en;
}

export { type Locale, type Dictionary };
