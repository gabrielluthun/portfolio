export const NAV_SECTIONS = [
  { id: "profil", key: "profil" },
  { id: "projets", key: "projets" },
  { id: "parcours", key: "parcours" },
  { id: "contact", key: "" },
] as const;

export type NavSectionKey = (typeof NAV_SECTIONS)[number]["key"] | "home";

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

export function resolveNavKey(input: {
  pathname: string;
  homePath: string;
  probe: number;
  sectionTops: Array<{ key: string; top: number }>;
}): string {
  const path = normalizePath(input.pathname);
  const home = normalizePath(input.homePath);

  if (path.includes("/projets") && path !== home) return "projets";
  if (path !== home) return "";

  let key: string = "home";
  for (const section of input.sectionTops) {
    if (section.top <= input.probe) key = section.key;
  }
  return key;
}

function headerOffset(): number {
  return document.querySelector("header")?.getBoundingClientRect().height ?? 0;
}

function currentKey(header: HTMLElement): string {
  const homeLink = header.querySelector<HTMLAnchorElement>('[data-nav="home"]');
  const homePath = homeLink?.pathname ?? "/";
  const probe = headerOffset() + 8;

  const sectionTops = NAV_SECTIONS.flatMap((section) => {
    const el = document.getElementById(section.id);
    if (!el) return [];
    return [{ key: section.key, top: el.getBoundingClientRect().top }];
  });

  return resolveNavKey({
    pathname: location.pathname,
    homePath,
    probe,
    sectionTops,
  });
}

function movePill(nav: HTMLElement, link: HTMLAnchorElement | null): void {
  const pill = nav.querySelector<HTMLElement>(".site-header__pill");
  if (!pill) return;

  if (!link) {
    pill.hidden = true;
    return;
  }

  const navBox = nav.getBoundingClientRect();
  const linkBox = link.getBoundingClientRect();
  pill.hidden = false;
  pill.style.width = `${linkBox.width}px`;
  pill.style.height = `${linkBox.height}px`;
  pill.style.transform = `translate(${linkBox.left - navBox.left}px, ${linkBox.top - navBox.top}px)`;
}

export function syncNavActive(): void {
  const header = document.querySelector(".site-header");
  if (!(header instanceof HTMLElement)) return;

  const nav = header.querySelector<HTMLElement>(".site-header__nav");
  if (!nav) return;

  const key = currentKey(header);
  let active: HTMLAnchorElement | null = null;

  header.querySelectorAll<HTMLAnchorElement>("[data-nav]").forEach((link) => {
    if (link.dataset.nav === key) {
      link.setAttribute("aria-current", "page");
      active = link;
    } else {
      link.removeAttribute("aria-current");
    }
  });

  movePill(nav, active);
}

let started = false;
let ticking = false;

function onScroll(): void {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    syncNavActive();
  });
}

/** Idempotent: safe with ClientRouter + transition:persist. */
export function initNavActive(): void {
  if (started) {
    syncNavActive();
    return;
  }
  started = true;

  document.addEventListener("astro:page-load", syncNavActive);
  window.addEventListener("hashchange", syncNavActive);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  syncNavActive();
}
