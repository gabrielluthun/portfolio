import experiencesFr from "../experiences.fr.json";
import experiencesEn from "../experiences.en.json";
import type { Experience } from "../../types/experience";
import type { Locale } from "../../i18n/locales";

const experiencesByLocale: Record<Locale, Experience[]> = {
  fr: experiencesFr as Experience[],
  en: experiencesEn as Experience[],
};

export function findAllExperiences(locale: Locale = "fr"): Experience[] {
  return experiencesByLocale[locale];
}
