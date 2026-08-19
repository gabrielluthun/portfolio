import { useEffect, useState } from "react";
import type { Locale } from "../i18n/locales";

const STORAGE_KEY = "theme";

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
}

type ThemeToggleProps = {
  locale?: Locale;
};

export default function ThemeToggle({ locale = "fr" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const syncFromStorage = () => {
      const dark = localStorage.getItem(STORAGE_KEY) !== "light";
      document.documentElement.classList.toggle("dark", dark);
      setIsDark(dark);
    };

    syncFromStorage();
    document.addEventListener("astro:after-swap", syncFromStorage);
    return () => document.removeEventListener("astro:after-swap", syncFromStorage);
  }, []);

  return (
    <button
      type="button"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-fg/25 text-fg hover:border-accent hover:text-accent"
      aria-pressed={isDark}
      aria-label={
        locale === "fr"
          ? isDark
            ? "Activer le mode clair"
            : "Activer le mode sombre"
          : isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
      }
      onClick={() => {
        const next = !isDark;
        setIsDark(next);
        applyTheme(next);
      }}
    >
      {isDark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[1.75]">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[1.75]">
          <path d="M15.5 13.5A6 6 0 0 1 10.5 4.2 7 7 0 1 0 19.8 13.5a6 6 0 0 1-4.3 0Z" />
        </svg>
      )}
    </button>
  );
}
