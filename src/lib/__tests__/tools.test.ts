import { describe, it, expect } from "vitest";
import { categories, tools, toolByPath, firstToolInCategory } from "../tools";

describe("tool registry integrity", () => {
  it("every category has at least one tool", () => {
    for (const cat of categories) {
      expect(tools.some((t) => t.category === cat.id)).toBe(true);
    }
  });

  it("every tool path is unique", () => {
    const paths = tools.map((t) => t.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("every tool id is unique", () => {
    const ids = tools.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("firstToolInCategory resolves for every category", () => {
    for (const cat of categories) {
      expect(firstToolInCategory(cat.id).category).toBe(cat.id);
    }
  });

  it("toolByPath resolves a known path and returns undefined for an unknown one", () => {
    expect(toolByPath("/jwt/validator")?.id).toBe("jwt-validator");
    expect(toolByPath("/not/a/real/path")).toBeUndefined();
  });

  it("every category has a short label suitable for the navbar (non-empty, reasonably short)", () => {
    for (const cat of categories) {
      expect(cat.shortLabel.length).toBeGreaterThan(0);
      expect(cat.shortLabel.length).toBeLessThanOrEqual(12);
    }
  });
});
