import projectsFr from "../projects.fr.json";
import projectsEn from "../projects.en.json";
import type { Project } from "../../types/project";
import type { Locale } from "../../i18n/locales";

const projectByLocale: Record<Locale, Project[]> = {
  fr: projectsFr as Project[],
  en: projectsEn as Project[],
};

export function findAllProjects(locale: Locale = "fr"): Project[] {
  return projectByLocale[locale];
}

export function findProjectById(
  id: string,
  locale: Locale = "fr",
): Project | undefined {
  return findAllProjects(locale).find((project) => project.id === id);
}
