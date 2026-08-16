import { describe, expect, it } from "vitest";
import {
  findAllProjects,
  findProjectById,
} from "../../src/data/repositories/project.repository";

describe("project repository", () => {
  it("loads featured and catalog projects from JSON", () => {
    const projects = findAllProjects();

    expect(projects.map((project) => project.id)).toEqual([
      "maxtracker",
      "hub-des-savoirs",
      "geekment-votre",
      "wwtbam-tribute",
      "angular-monster-slayer",
      "bots-discord-simplon",
      "air-fle-dashboard",
      "marche-et-deviens",
    ]);
    expect(projects.filter((project) => project.featured)).toHaveLength(4);
  });

  it("finds a project by id", () => {
    const project = findProjectById("maxtracker");

    expect(project?.title).toBe("MaxTracker");
    expect(project?.liveUrl).toBe("https://maxtracker.fr/");
    expect(project?.problem.length).toBeGreaterThan(0);
    expect(project?.solution.length).toBeGreaterThan(0);
    expect(project?.impact.length).toBeGreaterThan(0);
  });

  it("returns undefined for an unknown id", () => {
    expect(findProjectById("inconnu")).toBeUndefined();
  });
});
