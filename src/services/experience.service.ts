import { findAllExperiences } from "../data/repositories/experience.repository";
import type { Experience } from "../types/experience";
import type { Locale } from "../i18n/locales";

export function getExperiences(locale: Locale = "fr"): Experience[] {
  return findAllExperiences(locale);
}
