import { useEffect, useState } from "react";

const SHOW_AFTER_PX = 480;

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("astro:page-load", update);
    return () => {
      window.removeEventListener("scroll", update);
      document.removeEventListener("astro:page-load", update);
    };
  }, []);

  return (
    <button
      type="button"
      className={[
          "fixed right-4 bottom-4 z-40 inline-flex size-11 items-center justify-center rounded-full sm:right-6 sm:bottom-6",
        "border border-accent bg-bg/95 text-accent backdrop-blur-sm",
        "hover:bg-accent hover:text-accent-fg",
        "motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "motion-reduce:transition-none",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0 motion-reduce:translate-y-0",
      ].join(" ")}
      aria-label="Haut de page"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("portfolio:scroll-top"));
        if (window.location.hash) {
          history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
        }
      }}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[2]">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
