import { describe, it, expect } from "vitest";
import { generateUuid, isValidNamespace, NAMESPACES } from "../uuidgen";

describe("generateUuid", () => {
  it("v4 matches the version/variant format", () => {
    const id = generateUuid("v4");
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it("v1 has the correct version nibble", () => {
    const id = generateUuid("v1");
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it("v5 is deterministic for the same name and namespace", () => {
    const a = generateUuid("v5", { name: "example.com", namespace: NAMESPACES.DNS });
    const b = generateUuid("v5", { name: "example.com", namespace: NAMESPACES.DNS });
    expect(a).toBe(b);
  });

  it("v5 matches the known RFC 4122 test vector for example.com in the DNS namespace", () => {
    const id = generateUuid("v5", { name: "example.com", namespace: NAMESPACES.DNS });
    expect(id).toBe("cfbff0d1-9375-5685-968c-48ce8b15ae17");
  });
});

describe("isValidNamespace", () => {
  it("accepts a well-formed UUID", () => {
    expect(isValidNamespace(NAMESPACES.DNS)).toBe(true);
  });

  it("rejects garbage input", () => {
    expect(isValidNamespace("not-a-uuid")).toBe(false);
  });
});
