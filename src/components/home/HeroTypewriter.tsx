import { useLayoutEffect, useState } from "react";

const ROLE = "Développeur full-stack";
const NAME = "Gabriel Luthun";
const TAGLINE = "Je transforme des besoins métier en produits simples et utiles.";
const CHAR_MS = 24;
const LINE_PAUSE_MS = 90;

let hasPlayedThisDocument = false;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function typeLine(
  full: string,
  setText: (value: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const chars = Array.from(full);

  return new Promise((resolve) => {
    let index = 0;

    const tick = () => {
      if (signal.aborted) {
        resolve();
        return;
      }

      index += 1;
      setText(chars.slice(0, index).join(""));

      if (index >= chars.length) {
        window.setTimeout(resolve, LINE_PAUSE_MS);
        return;
      }

      window.setTimeout(tick, CHAR_MS);
    };

    tick();
  });
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[0.9em] w-[0.08em] translate-y-[0.08em] animate-pulse bg-current"
    />
  );
}

export default function HeroTypewriter() {
  const [role, setRole] = useState(ROLE);
  const [name, setName] = useState(NAME);
  const [tagline, setTagline] = useState(TAGLINE);
  const [line, setLine] = useState<"role" | "name" | "tagline" | "done">("done");

  useLayoutEffect(() => {
    if (hasPlayedThisDocument || prefersReducedMotion()) {
      return;
    }

    hasPlayedThisDocument = true;
    const controller = new AbortController();

    setRole("");
    setName("");
    setTagline("");
    setLine("role");

    void (async () => {
      await typeLine(ROLE, setRole, controller.signal);
      if (controller.signal.aborted) {
        return;
      }

      setLine("name");
      await typeLine(NAME, setName, controller.signal);
      if (controller.signal.aborted) {
        return;
      }

      setLine("tagline");
      await typeLine(TAGLINE, setTagline, controller.signal);
      if (controller.signal.aborted) {
        return;
      }

      setLine("done");
    })();

    return () => controller.abort();
  }, []);

  return (
    <>
      <p className="relative mb-4 text-sm font-medium tracking-wide text-accent uppercase">
        <span className="invisible" aria-hidden="true">
          {ROLE}
        </span>
        <span className="absolute inset-0">
          {role}
          {line === "role" ? <Caret /> : null}
        </span>
      </p>
      <h1 className="relative max-w-4xl">
        <span className="invisible" aria-hidden="true">
          {NAME}
        </span>
        <span className="absolute inset-0">
          {name}
          {line === "name" ? <Caret /> : null}
        </span>
      </h1>
      <p className="relative mt-6 max-w-xl text-lg">
        <span className="invisible" aria-hidden="true">
          {TAGLINE}
        </span>
        <span className="absolute inset-0">
          {tagline}
          {line === "tagline" ? <Caret /> : null}
        </span>
      </p>
    </>
  );
}
