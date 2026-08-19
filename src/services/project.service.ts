import { findAllProjects } from "../data/repositories/project.repository";
import type { Project } from "../types/project";
import type { Locale } from "../i18n/locales";

const FEATURED_LIMIT = 4;

export function getFeaturedProjects(
  limit = FEATURED_LIMIT,
  locale: Locale = "fr",
): Project[] {
  return findAllProjects(locale)
    .filter((project) => project.featured)
    .slice(0, limit);
}
