import { describe, it, expect } from "vitest";
import {
  generateRandomKey,
  generateApiKey,
  hashText,
  hashBytes,
  aesEncrypt,
  aesDecrypt,
  generateSigningKeyPair,
  generateRsaOaepKeyPair,
  rsaOaepEncrypt,
  rsaOaepDecrypt,
} from "../crypto";

describe("generateRandomKey", () => {
  it("produces the requested bit length in both encodings", () => {
    const key = generateRandomKey(256);
    expect(key.hex).toHaveLength(64); // 256 bits = 32 bytes = 64 hex chars
    expect(atob(key.base64)).toHaveLength(32);
  });
});

describe("generateApiKey", () => {
  it("applies the prefix and requested length", () => {
    const key = generateApiKey({ prefix: "sk_live_", length: 32, charset: "alphanumeric" });
    expect(key.startsWith("sk_live_")).toBe(true);
    expect(key.length).toBe("sk_live_".length + 32);
  });
});

describe("hashText / hashBytes", () => {
  // Known vectors verified against Node's own crypto module, not hand-typed from memory.
  it("matches known MD5 and SHA-256 test vectors for 'abc'", async () => {
    expect(await hashText("abc", "MD5")).toBe("900150983cd24fb0d6963f7d28e17f72");
    expect(await hashText("abc", "SHA-256")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("hashBytes and hashText agree on the UTF-8 encoding of the same string", async () => {
    const text = "café 🎉";
    const bytes = new TextEncoder().encode(text);
    expect(await hashBytes(bytes.buffer as ArrayBuffer, "SHA-512")).toBe(await hashText(text, "SHA-512"));
  });
});

describe("aesEncrypt / aesDecrypt", () => {
  it("round-trips with the correct passphrase", async () => {
    const enc = await aesEncrypt("hello world", "my-passphrase");
    const dec = await aesDecrypt(enc.ciphertext, "my-passphrase", enc.iv, enc.salt);
    expect(dec.ok).toBe(true);
    if (dec.ok) expect(dec.plaintext).toBe("hello world");
  });

  it("fails to decrypt with the wrong passphrase", async () => {
    const enc = await aesEncrypt("hello world", "my-passphrase");
    const dec = await aesDecrypt(enc.ciphertext, "wrong-passphrase", enc.iv, enc.salt);
    expect(dec.ok).toBe(false);
  });
});

describe("generateSigningKeyPair", () => {
  it("generates a usable RS256 key pair (PEM)", async () => {
    const kp = await generateSigningKeyPair("RS256");
    expect(kp.publicKeyPem).toContain("BEGIN PUBLIC KEY");
    expect(kp.privateKeyPem).toContain("BEGIN PRIVATE KEY");
  });

  it("generates a usable ES256 key pair (PEM)", async () => {
    const kp = await generateSigningKeyPair("ES256");
    expect(kp.publicKeyPem).toContain("BEGIN PUBLIC KEY");
  });
});

describe("RSA-OAEP", () => {
  it("encrypts with the public key and decrypts with the private key", async () => {
    const kp = await generateRsaOaepKeyPair(2048);
    const cipher = await rsaOaepEncrypt("secret message", kp.publicKey);
    const plain = await rsaOaepDecrypt(cipher, kp.privateKey);
    expect(plain.ok).toBe(true);
    if (plain.ok) expect(plain.plaintext).toBe("secret message");
  });
});
