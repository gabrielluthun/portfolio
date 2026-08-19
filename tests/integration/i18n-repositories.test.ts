import { describe, expect, it } from "vitest";
import {
  findAllExperiences,
} from "../../src/data/repositories/experience.repository";
import {
  findAllProjects,
  findProjectById,
} from "../../src/data/repositories/project.repository";

describe("repositories with english locale", () => {
  it("loads English projects content", () => {
    const projects = findAllProjects("en");

    expect(projects).toHaveLength(8);
    expect(projects[0]?.shortDescription).toContain("Aggregator");
  });

  it("finds a project by id in English locale", () => {
    const project = findProjectById("hub-des-savoirs", "en");

    expect(project?.title).toBe("Hub des Savoirs");
    expect(project?.problem).toContain("TV game show");
  });

  it("loads English experiences content", () => {
    const experiences = findAllExperiences("en");

    expect(experiences).toHaveLength(3);
    expect(experiences[1]?.title).toBe("Copywriter");
  });
});
