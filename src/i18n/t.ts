import { en } from "./en";
import { fr } from "./fr";
import type { Locale } from "./locales";

type Dictionary = typeof fr;

const dictionaries: Record<Locale, Dictionary> = {
  fr,
  en,
};

export function t(locale: Locale, key: keyof Dictionary): string {
  return dictionaries[locale][key] ?? fr[key] ?? String(key);
}

export function tf(
  locale: Locale,
  key: keyof Dictionary,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
    t(locale, key),
  );
}
