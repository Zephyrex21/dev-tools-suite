// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import {
  base64Encode,
  base64Decode,
  base64DecodeBytes,
  detectImageMime,
  urlEncode,
  urlDecode,
  testRegex,
  generateLorem,
  parseUrl,
  encodeHtmlEntities,
  decodeHtmlEntities,
  COMMON_HTML_ENTITIES,
} from "../encoding";

describe("Base64", () => {
  it("round-trips valid UTF-8 text", () => {
    const encoded = base64Encode("hello, world! café");
    const decoded = base64Decode(encoded);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("hello, world! café");
  });

  it("rejects invalid Base64 syntax", () => {
    expect(base64Decode("not valid base64!!!").ok).toBe(false);
  });

  it("reports an error (not garbled text) for binary data that isn't valid UTF-8", () => {
    const binaryBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0xff, 0xd8]);
    let binary = "";
    for (const b of binaryBytes) binary += String.fromCharCode(b);
    const b64 = btoa(binary);
    expect(base64Decode(b64).ok).toBe(false);
    // but the raw-bytes path should still succeed
    const bytesResult = base64DecodeBytes(b64);
    expect(bytesResult.ok).toBe(true);
    if (bytesResult.ok) expect(bytesResult.value.length).toBe(binaryBytes.length);
  });

  it("strips a data: URL prefix when decoding to bytes", () => {
    const bytes = new Uint8Array([1, 2, 3]);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    const dataUrl = "data:image/png;base64," + btoa(binary);
    const result = base64DecodeBytes(dataUrl);
    expect(result.ok).toBe(true);
    if (result.ok) expect(Array.from(result.value)).toEqual([1, 2, 3]);
  });
});

describe("detectImageMime", () => {
  it("detects PNG, JPEG, GIF, and WebP signatures", () => {
    expect(detectImageMime(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]))).toBe("image/png");
    expect(detectImageMime(new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]))).toBe("image/jpeg");
    expect(detectImageMime(new TextEncoder().encode("GIF89a..."))).toBe("image/gif");

    const webp = new Uint8Array(20);
    webp.set([0x52, 0x49, 0x46, 0x46], 0);
    webp.set([0x57, 0x45, 0x42, 0x50], 8);
    expect(detectImageMime(webp)).toBe("image/webp");
  });

  it("returns null for plain text", () => {
    expect(detectImageMime(new TextEncoder().encode("just some plain text"))).toBeNull();
  });
});

describe("URL encoding", () => {
  it("component mode encodes reserved characters", () => {
    expect(urlEncode("hello world&foo=bar", true)).toBe("hello%20world%26foo%3Dbar");
  });

  it("round-trips", () => {
    const encoded = urlEncode("a b&c", true);
    const decoded = urlDecode(encoded, true);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) expect(decoded.value).toBe("a b&c");
  });

  it("rejects invalid percent-encoding", () => {
    expect(urlDecode("%zz", true).ok).toBe(false);
  });
});

describe("testRegex", () => {
  it("finds all matches with the global flag", () => {
    const result = testRegex("\\d+", "g", "a1 b22 c333");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.matches.map((m) => m.match)).toEqual(["1", "22", "333"]);
  });

  it("reports invalid patterns without throwing", () => {
    expect(testRegex("(", "g", "test").ok).toBe(false);
  });

  it("does not infinite-loop on zero-width matches", () => {
    const result = testRegex("a*", "g", "bb");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.matches.length).toBeGreaterThan(0);
  });
});

describe("generateLorem", () => {
  it("generates the requested word count", () => {
    expect(generateLorem("words", 5).split(" ")).toHaveLength(5);
  });

  it("generates the requested sentence count", () => {
    const text = generateLorem("sentences", 2);
    expect((text.match(/\./g) || []).length).toBe(2);
  });
});

describe("parseUrl", () => {
  it("extracts protocol, host, and query params", () => {
    const result = parseUrl("https://user:pass@example.com:8443/a/b?x=1&y=2#frag");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.protocol).toBe("https:");
      expect(result.value.hostname).toBe("example.com");
      expect(result.value.port).toBe("8443");
      expect(result.value.queryParams).toEqual([
        { key: "x", value: "1" },
        { key: "y", value: "2" },
      ]);
    }
  });

  it("rejects a non-absolute URL", () => {
    expect(parseUrl("not a url").ok).toBe(false);
  });
});

describe("HTML entities", () => {
  it("round-trips tags and named entities", () => {
    const encoded = encodeHtmlEntities('<div class="x">A & B</div>');
    expect(encoded).toContain("&lt;div");
    const decoded = decodeHtmlEntities("&lt;b&gt;bold&lt;/b&gt; &amp; &copy;");
    expect(decoded).toBe("<b>bold</b> & \u00a9");
  });

  it("has a reasonably complete reference table", () => {
    expect(COMMON_HTML_ENTITIES.length).toBeGreaterThan(10);
  });
});
