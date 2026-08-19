import { describe, expect, it } from "vitest";
import {
  getLocaleFromPathname,
  isLocale,
  switchLocalePathname,
  withLocalePath,
} from "../../src/i18n/locales";

describe("i18n locales", () => {
  describe("isLocale", () => {
    it("accepts supported locales", () => {
      expect(isLocale("fr")).toBe(true);
      expect(isLocale("en")).toBe(true);
    });

    it("rejects unsupported locales", () => {
      expect(isLocale("de")).toBe(false);
      expect(isLocale("")).toBe(false);
    });
  });

  describe("getLocaleFromPathname", () => {
    it("returns en when path contains an /en segment", () => {
      expect(getLocaleFromPathname("/en/projects")).toBe("en");
      expect(getLocaleFromPathname("/portfolio/en/privacy")).toBe("en");
    });

    it("falls back to fr for non-en paths", () => {
      expect(getLocaleFromPathname("/")).toBe("fr");
      expect(getLocaleFromPathname("/projets/hub-des-savoirs")).toBe("fr");
    });
  });

  describe("withLocalePath", () => {
    it("keeps french routes without prefix", () => {
      expect(withLocalePath("fr", "projets")).toBe("projets");
      expect(withLocalePath("fr", "")).toBe("");
    });

    it("prefixes english routes with en", () => {
      expect(withLocalePath("en", "projects")).toBe("en/projects");
      expect(withLocalePath("en", "")).toBe("en");
    });
  });

  describe("switchLocalePathname", () => {
    const baseUrl = "/portfolio";

    it("maps French slugs to English slugs", () => {
      expect(
        switchLocalePathname(
          "/portfolio/projets/hub-des-savoirs/",
          "en",
          baseUrl,
        ),
      ).toBe("/en/projects/hub-des-savoirs");
      expect(
        switchLocalePathname("/portfolio/confidentialite", "en", baseUrl),
      ).toBe("/en/privacy");
    });

    it("maps English slugs to French slugs", () => {
      expect(
        switchLocalePathname("/portfolio/en/projects/maxtracker", "fr", baseUrl),
      ).toBe("/projets/maxtracker");
      expect(
        switchLocalePathname("/portfolio/en/legal-notice", "fr", baseUrl),
      ).toBe("/mentions-legales");
    });

    it("keeps unknown routes while switching locale prefix", () => {
      expect(switchLocalePathname("/portfolio/en/custom-route", "fr", baseUrl)).toBe(
        "/custom-route",
      );
      expect(switchLocalePathname("/portfolio/custom-route", "en", baseUrl)).toBe(
        "/en/custom-route",
      );
    });
  });
});
