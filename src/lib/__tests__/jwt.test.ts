import { describe, it, expect } from "vitest";
import { parseJwt, encodeJwt, verifyHmac, verifyAsymmetric, fuzzJwt } from "../jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.nmm0qepYRjhNji3O-jq8Pvcr7l_me1_bomw4EJucQCU";
const SECRET = "your-256-bit-secret";

describe("parseJwt", () => {
  it("decodes header and payload without verifying", () => {
    const parsed = parseJwt(SAMPLE);
    expect(parsed.structureValid).toBe(true);
    expect(parsed.header.alg).toBe("HS256");
    expect(parsed.payload.name).toBe("Ada Lovelace");
  });

  it("flags malformed tokens without throwing", () => {
    const parsed = parseJwt("not.a.jwt!!!");
    expect(parsed.headerError || parsed.payloadError).toBeTruthy();
  });
});

describe("verifyHmac", () => {
  it("verifies a correctly signed token", async () => {
    const result = await verifyHmac(SAMPLE, SECRET);
    expect(result.ok).toBe(true);
  });

  it("rejects an incorrect secret", async () => {
    const result = await verifyHmac(SAMPLE, "wrong-secret");
    expect(result.ok).toBe(false);
  });

  it("rejects a non-HMAC token with a helpful message", async () => {
    // A token that claims RS256 in its header but has no real RSA signature —
    // verifyHmac should recognize the alg mismatch and refuse cleanly.
    const fakeRsHeader = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" })).replace(/=+$/, "");
    const fakePayload = btoa(JSON.stringify({ a: 1 })).replace(/=+$/, "");
    const result = await verifyHmac(`${fakeRsHeader}.${fakePayload}.sig`, "x");
    expect(result.ok).toBe(false);
  });
});

describe("encodeJwt / verifyHmac round trip", () => {
  it("signs and verifies with a matching secret", async () => {
    const token = await encodeJwt({ header: { typ: "JWT" }, payload: { sub: "abc", role: "user" }, secret: "s3cret", alg: "HS256" });
    const result = await verifyHmac(token, "s3cret");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.payload.sub).toBe("abc");
  });

  it("supports HS384 and HS512", async () => {
    for (const alg of ["HS384", "HS512"] as const) {
      const token = await encodeJwt({ header: {}, payload: { a: 1 }, secret: "s", alg });
      const result = await verifyHmac(token, "s");
      expect(result.ok).toBe(true);
    }
  });
});

describe("verifyAsymmetric", () => {
  it("rejects when given an HMAC token", async () => {
    const result = await verifyAsymmetric(SAMPLE, "-----BEGIN PUBLIC KEY-----\nbogus\n-----END PUBLIC KEY-----");
    expect(result.ok).toBe(false);
  });
});

describe("fuzzJwt", () => {
  it("produces mutations covering known attack vectors", () => {
    const mutations = fuzzJwt(SAMPLE);
    expect(mutations.length).toBeGreaterThan(0);
    expect(mutations.some((m) => m.id === "alg-none")).toBe(true);
    expect(mutations.some((m) => m.id === "empty-sig")).toBe(true);
  });

  it("alg:none mutation has an empty signature and still-decodable payload", () => {
    const mutations = fuzzJwt(SAMPLE);
    const noneMutation = mutations.find((m) => m.id === "alg-none");
    expect(noneMutation?.token.endsWith(".")).toBe(true);
    const reparsed = parseJwt(noneMutation!.token);
    expect(reparsed.payload.name).toBe("Ada Lovelace");
  });
});
