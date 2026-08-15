import { describe, expect, it } from "vitest";
import { resolvePreviewImage } from "../../src/components/projects/preview-image";

describe("resolvePreviewImage", () => {
  it("leaves absolute http URLs unchanged", () => {
    const src = "https://example.com/cover.png";

    expect(resolvePreviewImage(src, "/portfolio/")).toBe(src);
  });

  it("prefixes a relative path with the base URL", () => {
    expect(resolvePreviewImage("assets/maxtracker.png", "/portfolio/")).toBe(
      "/portfolio/assets/maxtracker.png",
    );
  });

  it("adds a trailing slash to the base when missing", () => {
    expect(resolvePreviewImage("assets/logo.png", "/portfolio")).toBe(
      "/portfolio/assets/logo.png",
    );
  });

  it("strips a leading slash on the asset path", () => {
    expect(resolvePreviewImage("/assets/logo.png", "/portfolio/")).toBe(
      "/portfolio/assets/logo.png",
    );
  });
});
