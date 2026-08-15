import { useEffect, useRef } from "react";

export default function FadeIn() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = ref.current?.closest("section");
    if (!target) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (alreadyInView) {
        target.classList.remove("translate-y-6", "opacity-0");
        return;
      }

      target.classList.add(
        "translate-y-6",
        "opacity-0",
        "transition",
        "duration-700",
        "ease-out",
      );

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) {
            return;
          }

          target.classList.remove("translate-y-6", "opacity-0");
          observer?.disconnect();
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
      );

      observer.observe(target);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  return <span ref={ref} className="sr-only" />;
}
