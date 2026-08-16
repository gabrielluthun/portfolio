import experiences from "../experiences.json";
import type { Experience } from "../../types/experience";

export function findAllExperiences(): Experience[] {
  return experiences;
}
