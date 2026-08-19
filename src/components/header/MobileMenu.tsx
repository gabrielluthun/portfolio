import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { getMobileNavLinks } from "./nav-links";
import { switchLocalePathname, type Locale } from "../../i18n/locales";
import { t } from "../../i18n/t";
import { sitePath } from "../../lib/site-path";

type MobileMenuProps = {
  home: string;
  locale: Locale;
  pathname: string;
};

export default function MobileMenu({ home, locale, pathname }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const links = getMobileNavLinks({ home, locale });
  const frHref = sitePath(
    switchLocalePathname(pathname, "fr", import.meta.env.BASE_URL),
    import.meta.env.BASE_URL,
  );
  const enHref = sitePath(
    switchLocalePathname(pathname, "en", import.meta.env.BASE_URL),
    import.meta.env.BASE_URL,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const close = () => setOpen(false);
    document.addEventListener("astro:page-load", close);
    document.addEventListener("astro:after-swap", close);
    return () => {
      document.removeEventListener("astro:page-load", close);
      document.removeEventListener("astro:after-swap", close);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const drawer = (
    <div
      id={panelId}
      className={`site-header__drawer${open ? " is-open" : ""}`}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className="site-header__drawer-top">
        <a
          href={home}
          className="site-header__logo font-heading text-lg font-semibold tracking-tight no-underline"
          onClick={() => setOpen(false)}
        >
          Gabriel <span>Luthun</span>
        </a>
        <button
          type="button"
          className="site-header__menu-btn site-header__menu-btn--drawer"
          aria-label={t(locale, "menu.close")}
          onClick={() => setOpen(false)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.75]">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav aria-label={locale === "fr" ? "Navigation mobile" : "Mobile navigation"} className="site-header__drawer-nav">
        {links.map((link, index) => (
          <a
            key={link.key}
            href={link.href}
            data-nav={link.key}
            style={{ transitionDelay: open ? `${80 + index * 40}ms` : "0ms" }}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div
        className="mt-8 inline-flex w-fit items-center gap-1 rounded-full border border-border bg-bg-muted/40 p-1"
        aria-label={locale === "fr" ? "Sélecteur de langue" : "Language switcher"}
      >
        <a
          href={frHref}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold no-underline transition ${
            locale === "fr"
              ? "bg-accent text-accent-fg"
              : "text-fg-muted hover:text-fg"
          }`}
          aria-current={locale === "fr" ? "page" : undefined}
          hreflang="fr"
          lang="fr"
          onClick={() => setOpen(false)}
        >
          FR
        </a>
        <a
          href={enHref}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold no-underline transition ${
            locale === "en"
              ? "bg-accent text-accent-fg"
              : "text-fg-muted hover:text-fg"
          }`}
          aria-current={locale === "en" ? "page" : undefined}
          hreflang="en"
          lang="en"
          onClick={() => setOpen(false)}
        >
          EN
        </a>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className={`site-header__menu-btn${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t(locale, "menu.close") : t(locale, "menu.open")}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="site-header__burger" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
