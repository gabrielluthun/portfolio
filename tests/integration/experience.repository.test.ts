import { describe, expect, it } from "vitest";
import { findAllExperiences } from "../../src/data/repositories/experience.repository";

describe("experience repository", () => {
  it("loads the three LinkedIn roles from JSON", () => {
    const experiences = findAllExperiences();

    expect(experiences).toHaveLength(3);
    expect(experiences[0]?.organization).toContain("Simplon");
    expect(experiences[1]?.title).toBe("Copywriter");
    expect(experiences[2]?.organization).toContain("Auchan");
  });
});
