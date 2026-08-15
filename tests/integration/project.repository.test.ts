import { describe, expect, it } from "vitest";
import {
  findAllProjects,
  findProjectById,
} from "../../src/data/repositories/project.repository";

describe("project repository", () => {
  it("loads the three case studies from JSON", () => {
    const projects = findAllProjects();

    expect(projects.map((project) => project.id)).toEqual([
      "maxtracker",
      "geekment-votre",
      "hub-des-savoirs",
    ]);
  });

  it("finds a project by id", () => {
    const project = findProjectById("maxtracker");

    expect(project?.title).toBe("MaxTracker");
    expect(project?.liveUrl).toBe("https://maxtracker.fr/");
    expect(project?.benefits.length).toBeGreaterThan(0);
  });

  it("returns undefined for an unknown id", () => {
    expect(findProjectById("inconnu")).toBeUndefined();
  });
});
