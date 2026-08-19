import { describe, expect, it } from "vitest";
import {
  getMobileNavLinks,
  getPrimaryNavLinks,
} from "../../src/components/header/nav-links";

describe("nav links", () => {
  const home = "/portfolio";

  it("builds localized primary links in French", () => {
    expect(getPrimaryNavLinks({ home, locale: "fr" })).toEqual([
      { href: "/portfolio", key: "home", label: "Accueil" },
      { href: "/portfolio#profil", key: "profil", label: "Profil" },
      { href: "/portfolio#projets", key: "projets", label: "Projets" },
      { href: "/portfolio#parcours", key: "parcours", label: "Parcours" },
    ]);
  });

  it("builds localized primary links in English", () => {
    expect(getPrimaryNavLinks({ home, locale: "en" })).toEqual([
      { href: "/portfolio", key: "home", label: "Home" },
      { href: "/portfolio#profil", key: "profil", label: "Profile" },
      { href: "/portfolio#projects", key: "projets", label: "Projects" },
      { href: "/portfolio#journey", key: "parcours", label: "Journey" },
    ]);
  });

  it("adds contact CTA link in mobile navigation", () => {
    const links = getMobileNavLinks({ home, locale: "en" });

    expect(links).toHaveLength(5);
    expect(links[4]).toEqual({
      href: "/portfolio#contact",
      key: "contact",
      label: "Let's talk",
    });
  });
});
