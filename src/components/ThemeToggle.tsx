import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    sync();
    document.addEventListener("astro:after-swap", sync);
    return () => document.removeEventListener("astro:after-swap", sync);
  }, []);

  return (
    <button
      type="button"
      className="ml-2 rounded-md border border-border px-3 py-2 text-sm text-fg hover:border-accent hover:text-accent"
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
