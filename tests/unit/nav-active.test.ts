import { describe, expect, it } from "vitest";
import {
  normalizePath,
  resolveNavKey,
} from "../../src/components/header/nav-active";

describe("normalizePath", () => {
  it("strips trailing slashes", () => {
    expect(normalizePath("/portfolio/")).toBe("/portfolio");
  });

  it("keeps root as a single slash", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("")).toBe("/");
  });
});

describe("resolveNavKey", () => {
  const home = "/portfolio";

  it("marks catalog and case-study routes as projets", () => {
    expect(
      resolveNavKey({
        pathname: "/portfolio/projets",
        homePath: home,
        probe: 80,
        sectionTops: [],
      }),
    ).toBe("projets");

    expect(
      resolveNavKey({
        pathname: "/portfolio/projets/maxtracker/",
        homePath: home,
        probe: 80,
        sectionTops: [],
      }),
    ).toBe("projets");
  });

  it("defaults to home at the top of the landing page", () => {
    expect(
      resolveNavKey({
        pathname: "/portfolio/",
        homePath: home,
        probe: 80,
        sectionTops: [
          { key: "profil", top: 400 },
          { key: "projets", top: 900 },
          { key: "parcours", top: 1400 },
          { key: "", top: 2000 },
        ],
      }),
    ).toBe("home");
  });

  it("follows the last section that crossed the probe line", () => {
    expect(
      resolveNavKey({
        pathname: "/portfolio",
        homePath: home,
        probe: 80,
        sectionTops: [
          { key: "profil", top: -20 },
          { key: "projets", top: 40 },
          { key: "parcours", top: 500 },
          { key: "", top: 1200 },
        ],
      }),
    ).toBe("projets");
  });

  it("clears the pill on the contact section", () => {
    expect(
      resolveNavKey({
        pathname: "/portfolio",
        homePath: home,
        probe: 80,
        sectionTops: [
          { key: "profil", top: -800 },
          { key: "projets", top: -400 },
          { key: "parcours", top: -100 },
          { key: "", top: 20 },
        ],
      }),
    ).toBe("");
  });

  it("returns empty on unrelated routes", () => {
    expect(
      resolveNavKey({
        pathname: "/portfolio/page-inexistante",
        homePath: home,
        probe: 80,
        sectionTops: [],
      }),
    ).toBe("");
  });
});
