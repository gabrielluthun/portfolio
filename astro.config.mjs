// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://gabrielluthun.github.io",
  base: "/portfolio",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en"],
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
