import { describe, expect, it } from "vitest";
import { getExperiences } from "../../src/services/experience.service";

describe("getExperiences", () => {
  it("returns the LinkedIn roles in reverse chronological order", () => {
    const experiences = getExperiences();

    expect(experiences.map((item) => item.id)).toEqual([
      "simplon-cda",
      "copywriter-independant",
      "auchan-achats",
    ]);
  });
});
