import { describe, it, expect } from "vitest";
import { buildSemanticHints } from "../src/semantic.js";

describe("buildSemanticHints", () => {
  it("wraps hints in semantic_hints tags", () => {
    const hints = buildSemanticHints(12);
    expect(hints.startsWith("<semantic_hints>")).toBe(true);
    expect(hints.endsWith("</semantic_hints>")).toBe(true);
  });

  it("includes general conversational hints", () => {
    expect(buildSemanticHints(12)).toContain("人类常说话含蓄");
  });

  it("adds the late-night time hint only before 6am", () => {
    expect(buildSemanticHints(3)).toContain("凌晨");
    expect(buildSemanticHints(12)).not.toContain("凌晨");
  });
});
