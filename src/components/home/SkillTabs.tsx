import { useState, type ReactNode } from "react";

type SkillItem = { name: string; icon: ReactNode };

const ASSET_BASE_URL = `${import.meta.env.BASE_URL}assets/skills/`;

const SKILL_LOGOS: Partial<Record<string, string>> = {
  TypeScript: "typescript.png",
  Angular: "angular.png",
  React: "react.png",
  "Tailwind CSS": "tailwindcss.png",
  Vite: "vite.png",

  "Nest.js": "nestjs.png",
  FastAPI: "fastapi.png",
  ".NET": "dotnet.png",
  Kotlin: "kotlin.png",
  PostgreSQL: "postgresql.png",

  Supabase: "supabase.png",
  MongoDB: "mongodb.png",

  Tauri: "tauri.png",
  Electron: "electron.png",
  Docker: "docker.png",
  Git: "git.png",
  Linux: "linux.png",
};

function techLogo(name: string): ReactNode {
  const file = SKILL_LOGOS[name];
  if (!file) return null;

  return (
    <img
      aria-hidden="true"
      alt=""
      className="h-5 w-5 object-contain"
      src={`${ASSET_BASE_URL}${file}`}
    />
  );
}

const SKILL_GROUPS: { label: string; tabIcon: ReactNode; items: SkillItem[] }[] = [
  {
    label: "Front-end",
    tabIcon: (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M14.5 2A1.5 1.5 0 0 0 13 3.5v13a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 15.5 2h-1ZM6 4a1 1 0 0 0-1 1v10a1 1 0 1 0 2 0V5a1 1 0 0 0-1-1ZM9.5 5.5a1 1 0 1 0-2 0v9a1 1 0 1 0 2 0v-9ZM11 7a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1ZM2.5 9a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V9Z" />
      </svg>
    ),
    items: ["TypeScript", "Angular", "React", "Tailwind CSS", "Vite"].map((n) => ({
      name: n,
      icon: techLogo(n),
    })),
  },
  {
    label: "Back-end",
    tabIcon: (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4.632 3.533A2 2 0 0 1 6.577 2h6.846a2 2 0 0 1 1.945 1.533l1.976 8.234A3.489 3.489 0 0 0 16 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234Z" />
        <path fillRule="evenodd" d="M4 13a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4H4Zm11.24 2a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75V15Zm-2.25-.75a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75h-.01Z" clipRule="evenodd" />
      </svg>
    ),
    items: ["Nest.js", "FastAPI", ".NET", "Kotlin", "PostgreSQL"].map((n) => ({
      name: n,
      icon: techLogo(n),
    })),
  },
  {
    label: "Base de données",
    tabIcon: (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .75.75V6h-1.5V1.75A.75.75 0 0 1 8 1Zm-.75 5v3.296l-1.943-1.048a.75.75 0 0 0-1.114.757l.457 2.957-2.134 2.134A.75.75 0 0 0 3.047 15H5.5v1.25a.75.75 0 0 0 1.5 0V15h2v1.25a.75.75 0 0 0 1.5 0V15h2v1.25a.75.75 0 0 0 1.5 0V15h2.453a.75.75 0 0 0 .53-1.281l-2.134-2.134.457-2.957a.75.75 0 0 0-1.114-.757L12.25 9.296V6h-5Z" clipRule="evenodd" />
      </svg>
    ),
    items: ["Supabase", "MongoDB", "PostgreSQL"].map((n) => ({
      name: n,
      icon: techLogo(n),
    })),
  },
  {
    label: "Outils",
    tabIcon: (
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 0 1 4.25 2h11.5A2.25 2.25 0 0 1 18 4.25v8.5A2.25 2.25 0 0 1 15.75 15h-3.105a3.501 3.501 0 0 0 1.1 1.677A.75.75 0 0 1 13.26 18H6.74a.75.75 0 0 1-.484-1.323A3.501 3.501 0 0 0 7.355 15H4.25A2.25 2.25 0 0 1 2 12.75v-8.5Zm1.5 0a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H4.25a.75.75 0 0 1-.75-.75v-7.5Z" clipRule="evenodd" />
      </svg>
    ),
    items: ["Tauri", "Electron", "Docker", "Git", "Linux"].map((n) => ({
      name: n,
      icon: techLogo(n),
    })),
  },
];

export default function SkillTabs() {
  const [active, setActive] = useState(0);

  return (
    <div>
      <h2 className="mb-8 text-center text-accent">Stack technique</h2>

      <div
        className="mb-8 flex flex-wrap justify-center gap-3"
        role="tablist"
        aria-label="Catégories de compétences"
      >
        {SKILL_GROUPS.map((group, i) => {
          const isActive = i === active;
          return (
            <button
              key={group.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border bg-bg-muted/30 text-fg-muted hover:border-accent hover:text-accent"
              }`}
            >
              {group.tabIcon}
              {group.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-bg p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SKILL_GROUPS[active].items.map((skill) => (
            <div
              key={skill.name}
              className="group flex flex-col items-center gap-4 rounded-lg border border-border bg-bg-muted/40 p-5 transition-colors hover:border-accent"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-muted/30 text-fg">
                {skill.icon}
              </div>
              <span className="text-sm font-semibold text-fg">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
