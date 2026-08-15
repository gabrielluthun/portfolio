import {
  findAllProjects,
  findProjectById,
} from "../data/repositories/project.repository";
import type { Project } from "../types/project";

const FEATURED_LIMIT = 4;

export function getAllProjects(): Project[] {
  return findAllProjects();
}

export function getProjectById(id: string): Project | undefined {
  return findProjectById(id);
}

export function getFeaturedProjects(limit = FEATURED_LIMIT): Project[] {
  return findAllProjects()
    .filter((project) => project.featured)
    .slice(0, limit);
}
