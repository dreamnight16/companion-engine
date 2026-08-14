import { describe, it, expect } from "vitest";
import {
  formatSummaryBlock,
  estimateTokenUsage,
  shouldTriggerSummary,
  computeHistoryLimit,
} from "../src/summary.js";

describe("formatSummaryBlock", () => {
  it("returns empty string for empty summary", () => {
    expect(formatSummaryBlock("")).toBe("");
  });

  it("wraps summary in conversation_summary tags", () => {
    const block = formatSummaryBlock("之前聊了旅行计划");
    expect(block).toContain("<conversation_summary>");
    expect(block).toContain("之前聊了旅行计划");
    expect(block).toContain("</conversation_summary>");
  });
});

describe("estimateTokenUsage", () => {
  it("returns 0 for empty messages", () => {
    expect(estimateTokenUsage([])).toBe(0);
  });

  it("estimates tokens from content length plus role overhead", () => {
    expect(estimateTokenUsage([{ role: "user", content: "123456789012" }])).toBe(8);
  });
});

describe("shouldTriggerSummary", () => {
  it("returns false when estimated tokens are below threshold", () => {
    expect(shouldTriggerSummary([], 100)).toBe(false);
  });

  it("returns true when estimated tokens exceed 60% of context window", () => {
    expect(shouldTriggerSummary([{ role: "user", content: "x".repeat(1000) }], 100)).toBe(true);
  });
});

describe("computeHistoryLimit", () => {
  it("returns 0 for empty messages", () => {
    expect(computeHistoryLimit([], 100)).toBe(0);
  });

  it("returns full message count when all messages fit", () => {
    expect(
      computeHistoryLimit(
        [
          { role: "user", content: "hi" },
          { role: "assistant", content: "there" },
        ],
        1000,
      ),
    ).toBe(2);
  });

  it("truncates older messages when token budget is exceeded", () => {
    expect(
      computeHistoryLimit(
        [
          { role: "user", content: "aaaaaaaaaa" },
          { role: "assistant", content: "bbbbbbbbbb" },
          { role: "user", content: "cccccccccc" },
        ],
        18,
      ),
    ).toBe(2);
  });
});
