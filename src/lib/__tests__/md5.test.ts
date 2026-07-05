import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { md5, md5Hex } from "../md5";

function nodeMd5(text: string): string {
  return crypto.createHash("md5").update(text, "utf8").digest("hex");
}

describe("md5", () => {
  it("matches Node's crypto module across a range of lengths, including block-boundary edge cases", () => {
    const inputs = [
      "",
      "a",
      "abc",
      "message digest",
      "abcdefghijklmnopqrstuvwxyz",
      "a".repeat(55),
      "a".repeat(56), // exactly at the padding boundary
      "a".repeat(57),
      "a".repeat(63),
      "a".repeat(64), // exactly one block
      "a".repeat(65),
      "a".repeat(119),
      "a".repeat(120),
      "café",
      "日本語テスト",
      "🎉emoji test🎉",
    ];
    for (const input of inputs) {
      expect(md5(input)).toBe(nodeMd5(input));
    }
  });
});

describe("md5Hex", () => {
  it("agrees with md5() when given the same text as UTF-8 bytes", () => {
    expect(md5Hex(new TextEncoder().encode("hello world"))).toBe(md5("hello world"));
  });

  it("hashes raw binary data correctly (not just text)", () => {
    const binary = new Uint8Array([0, 1, 2, 255, 254, 253, 128, 64, 32, 16, 8, 4, 2, 1, 0]);
    const expected = crypto.createHash("md5").update(Buffer.from(binary)).digest("hex");
    expect(md5Hex(binary)).toBe(expected);
  });
});
