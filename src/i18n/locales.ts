export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getLocaleFromPathname(pathname: string): Locale {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return /(^|\/)en(\/|$)/.test(normalized) ? "en" : DEFAULT_LOCALE;
}

export function withLocalePath(locale: Locale, path: string): string {
  const normalized = path.replace(/^\//, "");
  if (locale === "fr") return normalized;
  return normalized ? `en/${normalized}` : "en";
}

export function switchLocalePathname(
  pathname: string,
  targetLocale: Locale,
  baseUrl: string,
): string {
  const clean = pathname.replace(/\/+$/, "");
  const noLeading = clean.replace(/^\/+/, "");
  const base = baseUrl.replace(/^\/+|\/+$/g, "");
  const withoutBase = base
    ? noLeading === base
      ? ""
      : noLeading.startsWith(`${base}/`)
        ? noLeading.slice(base.length + 1)
        : noLeading
    : noLeading;
  const withoutEn = withoutBase.startsWith("en/")
    ? withoutBase.slice(3)
    : withoutBase === "en"
      ? ""
      : withoutBase;
  const routeWithoutLocale = withoutEn
    .replace(/^projects(\/|$)/, "projets$1")
    .replace(/^privacy(\/|$)/, "confidentialite$1")
    .replace(/^legal-notice(\/|$)/, "mentions-legales$1");
  const routeForTargetLocale =
    targetLocale === "en"
      ? routeWithoutLocale
          .replace(/^projets(\/|$)/, "projects$1")
          .replace(/^confidentialite(\/|$)/, "privacy$1")
          .replace(/^mentions-legales(\/|$)/, "legal-notice$1")
      : routeWithoutLocale;
  const localized = withLocalePath(targetLocale, routeForTargetLocale);
  return `/${localized}`.replace(/\/+$/, "") || "/";
}
