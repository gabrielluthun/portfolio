import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";

const HASH_KEY = "portfolio-hash";
const ALIGN_PX = 4;
const SCROLL_DURATION = 1.15;

function headerOffset() {
  return document.querySelector("header")?.getBoundingClientRect().height ?? 0;
}

function readHash() {
  return (
    decodeURIComponent(window.location.hash.replace("#", "")) ||
    sessionStorage.getItem(HASH_KEY) ||
    ""
  );
}

function samePath(url: URL) {
  const current = window.location.pathname.replace(/\/$/, "") || "/";
  const next = url.pathname.replace(/\/$/, "") || "/";
  return current === next;
}

function scrollPositionFor(target: HTMLElement) {
  return Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset());
}

function scrollToTop(lenis: LenisRef["lenis"] | undefined, animated: boolean) {
  if (lenis) {
    lenis.scrollTo(0, animated ? { duration: SCROLL_DURATION } : { immediate: true });
    return;
  }
  window.scrollTo({ top: 0, behavior: animated ? "smooth" : "instant" });
}

export default function SmoothScroll() {
  const lenisRef = useRef<LenisRef>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const scrollToHash = (options?: { animated?: boolean }) => {
      const animated = Boolean(options?.animated) && enabled;
      const id = readHash();
      if (!id) {
        return;
      }

      const target = document.getElementById(id);
      if (!target) {
        return;
      }

      sessionStorage.removeItem(HASH_KEY);

      const top = scrollPositionFor(target);
      if (Math.abs(top - window.scrollY) < ALIGN_PX) {
        return;
      }

      const lenis = lenisRef.current?.lenis;
      if (lenis) {
        lenis.scrollTo(top, animated ? { duration: SCROLL_DURATION } : { immediate: true });
        return;
      }

      window.scrollTo({ top, behavior: animated ? "smooth" : "instant" });
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link?.href) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (!url.hash) {
        sessionStorage.removeItem(HASH_KEY);
        if (!samePath(url)) {
          return;
        }

        // Accueil (same page, no hash): progressive return to top.
        event.preventDefault();
        if (window.location.hash) {
          history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
        }
        scrollToTop(lenisRef.current?.lenis, enabled);
        return;
      }

      sessionStorage.setItem(HASH_KEY, url.hash.replace("#", ""));

      if (!samePath(url)) {
        return;
      }

      event.preventDefault();
      if (window.location.hash !== url.hash) {
        history.pushState(
          null,
          "",
          `${window.location.pathname}${window.location.search}${url.hash}`,
        );
      }
      scrollToHash({ animated: true });
    };

    const onSwap = () => {
      window.requestAnimationFrame(() => scrollToHash({ animated: false }));
    };

    const onScrollTop = () => {
      scrollToTop(lenisRef.current?.lenis, enabled);
    };

    scrollToHash({ animated: false });
    document.addEventListener("astro:page-load", onSwap);
    document.addEventListener("astro:after-swap", onSwap);
    document.addEventListener("click", onClick);
    window.addEventListener("portfolio:scroll-top", onScrollTop);

    return () => {
      document.removeEventListener("astro:page-load", onSwap);
      document.removeEventListener("astro:after-swap", onSwap);
      document.removeEventListener("click", onClick);
      window.removeEventListener("portfolio:scroll-top", onScrollTop);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <ReactLenis root ref={lenisRef} />;
}
