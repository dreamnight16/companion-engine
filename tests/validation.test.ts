import { describe, it, expect } from "vitest";
import { validateProfileSchema, validateAppConfig } from "../src/validation.js";

const validProfile = {
  name: "小美",
  age: 20,
  user_nickname: "宝贝",
  user_gender: "male",
  partner_gender: "female",
  relationship_type: "girlfriend",
  relationship_mode: "direct",
};

describe("validateProfileSchema", () => {
  it("accepts a valid profile", () => {
    const result = validateProfileSchema(validProfile);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.profile.name).toBe("小美");
      expect(result.profile.age).toBe(20);
    }
  });

  it("applies defaults for optional fields", () => {
    const result = validateProfileSchema(validProfile);
    if (result.success) {
      expect(result.profile.city).toBe("");
      expect(result.profile.hobbies).toEqual([]);
      expect(result.profile.temperament).toBe("温柔");
    }
  });

  it("rejects an age below 14", () => {
    const result = validateProfileSchema({ ...validProfile, age: 13 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("年龄不能低于14岁");
    }
  });

  it("rejects an empty name", () => {
    const result = validateProfileSchema({ ...validProfile, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("角色名不能为空");
    }
  });
});

const validConfig = {
  ai: { provider: "anthropic", model: "claude-sonnet-4-5" },
  memory: {},
};

describe("validateAppConfig", () => {
  it("accepts a valid config", () => {
    const result = validateAppConfig(validConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.config.ai.provider).toBe("anthropic");
      expect(result.config.ai.model).toBe("claude-sonnet-4-5");
    }
  });

  it("applies defaults for memory and content filter", () => {
    const result = validateAppConfig(validConfig);
    if (result.success) {
      expect(result.config.memory.maxHistoryTurns).toBe(8);
      expect(result.config.contentFilter).toBe("strict");
      expect(result.config.topicSelfCheck).toBe(false);
    }
  });

  it("rejects an invalid provider", () => {
    const result = validateAppConfig({
      ai: { provider: "gemini", model: "x" },
      memory: {},
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Invalid enum value");
    }
  });

  it("rejects an empty model name", () => {
    const result = validateAppConfig({
      ai: { provider: "anthropic", model: "" },
      memory: {},
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("at least 1 character");
    }
  });
});
