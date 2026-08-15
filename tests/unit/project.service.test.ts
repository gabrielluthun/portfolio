import { describe, expect, it } from "vitest";
import { getFeaturedProjects } from "../../src/services/project.service";

describe("getFeaturedProjects", () => {
  it("returns only featured projects", () => {
    const featured = getFeaturedProjects();

    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((project) => project.featured)).toBe(true);
  });

  it("respects the requested limit", () => {
    const featured = getFeaturedProjects(2);

    expect(featured).toHaveLength(2);
  });
});
