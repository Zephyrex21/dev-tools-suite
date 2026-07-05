import { describe, it, expect } from "vitest";
import { generatePassword, generatePasswords, generateMemorablePassword, estimateStrength, estimateMemorableStrength } from "../password";

describe("generatePassword", () => {
  it("produces a PIN via numeric-only options", () => {
    const pin = generatePassword({ length: 6, uppercase: false, lowercase: false, numbers: true, symbols: false, excludeAmbiguous: false });
    expect(pin).toMatch(/^\d{6}$/);
  });

  it("returns empty string when no character set is selected", () => {
    const pwd = generatePassword({ length: 10, uppercase: false, lowercase: false, numbers: false, symbols: false, excludeAmbiguous: false });
    expect(pwd).toBe("");
  });
});

describe("generatePasswords (bulk)", () => {
  it("generates the requested count, all the correct length", () => {
    const bulk = generatePasswords({ length: 12, uppercase: true, lowercase: true, numbers: true, symbols: false, excludeAmbiguous: false }, 5);
    expect(bulk).toHaveLength(5);
    expect(bulk.every((p) => p.length === 12)).toBe(true);
  });
});

describe("generateMemorablePassword", () => {
  it("joins the requested word count with the separator", () => {
    const pwd = generateMemorablePassword({ wordCount: 4, separator: "-", capitalize: false, includeNumber: false });
    expect(pwd.split("-")).toHaveLength(4);
  });

  it("capitalizes words when requested", () => {
    const pwd = generateMemorablePassword({ wordCount: 3, separator: "-", capitalize: true, includeNumber: false });
    expect(pwd.split("-").every((w) => /^[A-Z][a-z]+$/.test(w))).toBe(true);
  });

  it("appends a trailing number when requested", () => {
    const pwd = generateMemorablePassword({ wordCount: 3, separator: "-", capitalize: false, includeNumber: true });
    const parts = pwd.split("-");
    expect(parts).toHaveLength(4);
    expect(parts[3]).toMatch(/^\d+$/);
  });
});

describe("entropy estimation", () => {
  it("character-based estimate scales with pool size and length", () => {
    const weak = estimateStrength("abc");
    const strong = estimateStrength("aB3!xQ9#zR2$mN7@");
    expect(strong.bitsOfEntropy).toBeGreaterThan(weak.bitsOfEntropy);
  });

  // The correctness-critical property: memorable-password entropy MUST use
  // log2(dictionary size) per word, not the character-based formula — using
  // the character formula on a dictionary-word password wildly overstates
  // its real strength.
  it("memorable-password entropy is word-count-based, not character-count-based", () => {
    const memOpts = { wordCount: 4, separator: "-", capitalize: true, includeNumber: false };
    const result = estimateMemorableStrength(memOpts);
    // 4 words from a small (~150 word) dictionary is a modest number of bits,
    // nowhere near what a naive per-character calculation on the resulting
    // ~25-char string would suggest.
    expect(result.bitsOfEntropy).toBeGreaterThan(20);
    expect(result.bitsOfEntropy).toBeLessThan(45);
  });
});
