import { useEffect, useRef } from "react";

export default function FadeIn() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const target = ref.current?.closest("section");
    if (!target) {
      return;
    }

    target.classList.add(
      "translate-y-6",
      "opacity-0",
      "transition",
      "duration-700",
      "ease-out",
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        target.classList.remove("translate-y-6", "opacity-0");
        observer.disconnect();
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return <span ref={ref} className="sr-only" />;
}
