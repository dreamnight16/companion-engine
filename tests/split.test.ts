import { describe, it, expect } from "vitest";
import { splitForChat } from "../src/split.js";

describe("splitForChat", () => {
  it("returns a single empty string for empty input", () => {
    expect(splitForChat("")).toEqual([""]);
  });

  it("returns the text as-is when there is no sentence boundary", () => {
    expect(splitForChat("你好")).toEqual(["你好"]);
  });

  it("splits on Chinese sentence punctuation", () => {
    expect(splitForChat("你好。今天天气很好。")).toEqual(["你好。", "今天天气很好。"]);
  });

  it("removes full-width parenthetical content", () => {
    expect(splitForChat("你好（微笑）呀")).toEqual(["你好呀"]);
  });

  it("removes action and thought markers", () => {
    expect(splitForChat("你好*挥手*呀")).toEqual(["你好呀"]);
    expect(splitForChat("你好_想你了_呀")).toEqual(["你好呀"]);
  });

  it("merges trailing punctuation-only segments into the previous sentence", () => {
    expect(splitForChat("你好。！")).toEqual(["你好。！"]);
  });

  it("splits over-long segments on commas", () => {
    const parts = splitForChat("a".repeat(40) + "，" + "b".repeat(40));
    expect(parts).toEqual(["a".repeat(40) + "，", "b".repeat(40)]);
  });
});
