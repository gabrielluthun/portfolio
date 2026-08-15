import { findAllProjects } from "../data/repositories/project.repository";
import type { Project } from "../types/project";

const FEATURED_LIMIT = 4;

export function getFeaturedProjects(limit = FEATURED_LIMIT): Project[] {
  return findAllProjects()
    .filter((project) => project.featured)
    .slice(0, limit);
}
