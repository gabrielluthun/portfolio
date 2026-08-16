import { describe, expect, it } from "vitest";
import { renderInlineMarkdown } from "../../src/lib/inline-markdown";

describe("renderInlineMarkdown", () => {
  it("renders bold and italic markers", () => {
    expect(renderInlineMarkdown("un **gain** et une *friction*")).toBe(
      "un <strong>gain</strong> et une <em>friction</em>",
    );
  });

  it("escapes HTML before applying markers", () => {
    expect(renderInlineMarkdown("<script>**x**</script>")).toBe(
      "&lt;script&gt;<strong>x</strong>&lt;/script&gt;",
    );
  });
});
