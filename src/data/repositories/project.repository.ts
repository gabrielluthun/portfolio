import projects from "../projects.json";
import type { Project } from "../../types/project";

export function findAllProjects(): Project[] {
  return projects;
}

export function findProjectById(id: string): Project | undefined {
  return findAllProjects().find((project) => project.id === id);
}
