import { findAllExperiences } from "../data/repositories/experience.repository";
import type { Experience } from "../types/experience";

export function getExperiences(): Experience[] {
  return findAllExperiences();
}
