import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";

const HASH_KEY = "portfolio-hash";
const ALIGN_PX = 4;

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
    const scrollToHash = () => {
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
        lenis.scrollTo(top, { immediate: true });
        return;
      }

      window.scrollTo({ top, behavior: "instant" });
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link?.href) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || !url.hash) {
        sessionStorage.removeItem(HASH_KEY);
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
      scrollToHash();
    };

    const onSwap = () => {
      window.requestAnimationFrame(scrollToHash);
    };

    scrollToHash();
    document.addEventListener("astro:page-load", onSwap);
    document.addEventListener("astro:after-swap", onSwap);
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("astro:page-load", onSwap);
      document.removeEventListener("astro:after-swap", onSwap);
      document.removeEventListener("click", onClick);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <ReactLenis root ref={lenisRef} />;
}
