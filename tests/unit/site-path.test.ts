import { describe, expect, it } from "vitest";
import { sitePath } from "../../src/lib/site-path";

describe("sitePath", () => {
  it("joins a segment when the base has no trailing slash", () => {
    expect(sitePath("projets", "/portfolio")).toBe("/portfolio/projets");
  });

  it("joins a segment when the base already has a trailing slash", () => {
    expect(sitePath("projets", "/portfolio/")).toBe("/portfolio/projets");
  });

  it("returns the normalized base for an empty path", () => {
    expect(sitePath("", "/portfolio")).toBe("/portfolio/");
  });
});
