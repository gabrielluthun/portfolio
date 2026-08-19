import type { Locale } from "../../i18n/locales";
import { t } from "../../i18n/t";

export type NavLink = {
  href: string;
  key: string;
  label: string;
};

type GetNavLinkInput = {
  home: string;
  locale: Locale;
};

export function getPrimaryNavLinks({ home, locale }: GetNavLinkInput): NavLink[] {
  const projectsId = locale === "en" ? "projects" : "projets";
  const journeyId = locale === "en" ? "journey" : "parcours";

  return [
    { href: home, key: "home", label: t(locale, "nav.home") },
    { href: `${home}#profil`, key: "profil", label: t(locale, "nav.profile") },
    { href: `${home}#${projectsId}`, key: "projets", label: t(locale, "nav.projects") },
    { href: `${home}#${journeyId}`, key: "parcours", label: t(locale, "nav.journey") },
  ];
}

export function getMobileNavLinks({ home, locale }: GetNavLinkInput): NavLink[] {
  return [
    ...getPrimaryNavLinks({ home, locale }),
    { href: `${home}#contact`, key: "contact", label: t(locale, "nav.contact") },
  ];
}
