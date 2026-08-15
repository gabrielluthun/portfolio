import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      const dark = localStorage.getItem(STORAGE_KEY) === "dark";
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
      className="shrink-0 rounded-md border border-border px-2 py-1.5 text-xs text-fg hover:border-accent hover:text-accent sm:ml-2 sm:px-3 sm:py-2 sm:text-sm"
      aria-pressed={isDark}
      onClick={() => {
        const next = !isDark;
        setIsDark(next);
        applyTheme(next);
      }}
    >
      {isDark ? "Mode clair" : "Mode sombre"}
    </button>
  );
}
