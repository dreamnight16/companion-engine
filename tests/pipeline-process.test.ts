import { describe, it, expect, beforeEach, vi } from "vitest";
import type { LanguageModel } from "ai";

// Mock the "ai" module so the generation stage never hits the network.
// Only `generateText` is exercised by the non-stream pipeline in these tests.
vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({ text: "你好呀！" }),
}));

import { processMessage, processMessageStream } from "../src/pipeline.js";
import { setStorageAdapter, type AppConfig, type Profile } from "../src/config.js";
import { MemoryStorage } from "../src/storage.js";

// A minimal stand-in for the AI SDK LanguageModel; the pipeline never
// dereferences its internals in these tests (generation is mocked).
const mockModel = {
  specificationVersion: "v1",
  provider: "test-provider",
  modelId: "test-model",
} as unknown as LanguageModel;

const profile: Profile = {
  name: "小梦",
  age: 20,
  city: "上海",
  occupation: "学生",
  education: "大学",
  major: "文学",
  hobbies: ["阅读"],
  temperament: "温柔",
  speaking_style: "可爱",
  user_nickname: "测试用户",
  user_gender: "male",
  partner_gender: "female",
  relationship_type: "girlfriend",
  relationship_mode: "direct",
  user_city: "上海",
  user_timezone: "Asia/Shanghai",
  opinions: {},
  daily_life: "学习",
  quirks: [],
  meme_style: "可爱",
};

const config: AppConfig = {
  ai: {
    provider: "openai",
    model: "gpt-test",
    apiKey: "test",
    maxTokens: 100,
    temperature: 0.5,
  },
  qq: { wsUrl: "ws://127.0.0.1:3001", accessToken: "", reconnectIntervalMs: 5000 },
  wechat: { baseUrl: "", fileUrl: "" },
  memory: { maxHistoryTurns: 8, longTermExtractInterval: 20, maxFactsInContext: 5 },
  contentFilter: "strict",
  topicSelfCheck: false,
};

beforeEach(() => {
  // Avoid disk I/O: route all storage through an in-memory adapter.
  setStorageAdapter(new MemoryStorage());
});

describe("processMessage", () => {
  it("returns early for the relationship flow without calling the model", async () => {
    const result = await processMessage("user-early", "我喜欢你", {
      model: mockModel,
      config,
      profile,
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toContain("我们已经在一起了呀");
  });

  it("runs the full stage flow and returns the mocked model reply", async () => {
    const result = await processMessage("user-full", "今天过得怎么样", {
      model: mockModel,
      config,
      profile,
    });

    expect(result).toEqual(["你好呀！"]);
  });
});

describe("processMessageStream", () => {
  it("yields early-return bubbles from the relationship flow", async () => {
    const chunks: string[] = [];
    for await (const chunk of processMessageStream("user-stream", "我喜欢你", {
      model: mockModel,
      config,
      profile,
    })) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join("")).toContain("我们已经在一起了呀");
  });
});
