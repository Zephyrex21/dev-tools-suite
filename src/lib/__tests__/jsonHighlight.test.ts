import { describe, it, expect } from "vitest";
import { tokenizeJson } from "../jsonHighlight";

function reconstruct(text: string): string {
  return tokenizeJson(text).map((t) => t.text).join("");
}

describe("tokenizeJson", () => {
  it("reconstructs the exact original text (critical invariant — the highlighted view must never show different text than the real value)", () => {
    const samples = [
      '{"name":"Ada","born":1815,"tags":["a","b"],"active":true,"mentor":null}',
      '{\n  "nested": {\n    "a": 1.5e10,\n    "b": -42\n  }\n}',
      '{"key with \\"escaped\\" quotes": "value with \\n newline"}',
      "",
      '{"incomplete": "still typing',
      "[1,2,3]",
      '"just a bare string"',
      '{"a":"value:with:colons"}',
    ];
    for (const s of samples) {
      expect(reconstruct(s)).toBe(s);
    }
  });

  it("classifies a key vs. a string value correctly", () => {
    const tokens = tokenizeJson('{"name":"Ada"}');
    expect(tokens.find((t) => t.text === '"name"')?.type).toBe("key");
    expect(tokens.find((t) => t.text === '"Ada"')?.type).toBe("string");
  });

  it("does not misclassify a string value containing a colon as a key", () => {
    const tokens = tokenizeJson('{"a":"value:with:colons"}');
    const valueToken = tokens.find((t) => t.text === '"value:with:colons"');
    expect(valueToken?.type).toBe("string");
  });

  it("classifies booleans, null, and numbers (including negative exponents)", () => {
    const tokens = tokenizeJson('{"active":true,"x":null,"n":-3.14e2}');
    expect(tokens.find((t) => t.text === "true")?.type).toBe("boolean");
    expect(tokens.find((t) => t.text === "null")?.type).toBe("null");
    expect(tokens.find((t) => t.text === "-3.14e2")?.type).toBe("number");
  });
});
