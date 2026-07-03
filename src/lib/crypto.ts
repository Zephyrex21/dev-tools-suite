import { md5 } from "js-md5";
import { toPem, fromPem } from "./pem";

// ---- Random key / API key generation ----

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toStdBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function generateRandomKey(bits: number): { hex: string; base64: string } {
  const bytes = crypto.getRandomValues(new Uint8Array(bits / 8));
  return { hex: toHex(bytes), base64: toStdBase64(bytes) };
}

const APIKEY_CHARSETS = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  hex: "0123456789abcdef",
  base62: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
} as const;

export interface ApiKeyOptions {
  prefix?: string;
  length: number;
  charset: keyof typeof APIKEY_CHARSETS;
}

export function generateApiKey({ prefix = "", length, charset }: ApiKeyOptions): string {
  const alphabet = APIKEY_CHARSETS[charset];
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let body = "";
  for (let i = 0; i < length; i++) body += alphabet[bytes[i] % alphabet.length];
  return prefix ? `${prefix}${body}` : body;
}

// ---- Hashing ----

export type HashAlgo = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export async function hashText(text: string, algo: HashAlgo): Promise<string> {
  if (algo === "MD5") return md5(text);
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algo, data);
  return toHex(new Uint8Array(digest));
}

// ---- AES-GCM symmetric encryption (passphrase-based, PBKDF2) ----

const PBKDF2_ITERATIONS = 250_000;

async function deriveAesKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export interface AesEncryptResult {
  ciphertext: string; // base64
  iv: string; // base64
  salt: string; // base64
}

export async function aesEncrypt(plaintext: string, passphrase: string): Promise<AesEncryptResult> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(passphrase, salt);
  const encoded = new TextEncoder().encode(plaintext);
  const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, encoded);
  return {
    ciphertext: toStdBase64(new Uint8Array(cipherBuf)),
    iv: toStdBase64(iv),
    salt: toStdBase64(salt),
  };
}

function stdBase64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function aesDecrypt(
  ciphertextB64: string,
  passphrase: string,
  ivB64: string,
  saltB64: string,
): Promise<{ ok: true; plaintext: string } | { ok: false; error: string }> {
  try {
    const salt = stdBase64ToBytes(saltB64);
    const iv = stdBase64ToBytes(ivB64);
    const key = await deriveAesKey(passphrase, salt);
    const cipherBytes = stdBase64ToBytes(ciphertextB64);
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, cipherBytes as BufferSource);
    return { ok: true, plaintext: new TextDecoder().decode(plainBuf) };
  } catch {
    return { ok: false, error: "Decryption failed — wrong passphrase, or the ciphertext/IV/salt don't match." };
  }
}

// ---- RSA / EC key pairs for JWT signing (RS*/ES*) ----

export type SigningAlg = "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512";

const EC_CURVES: Record<string, string> = { ES256: "P-256", ES384: "P-384", ES512: "P-521" };
const HASH_FOR: Record<string, string> = {
  RS256: "SHA-256",
  RS384: "SHA-384",
  RS512: "SHA-512",
  ES256: "SHA-256",
  ES384: "SHA-384",
  ES512: "SHA-512",
};

export interface KeyPairResult {
  publicKeyPem: string;
  privateKeyPem: string;
  publicKeyJwk: JsonWebKey;
  privateKeyJwk: JsonWebKey;
}

export async function generateSigningKeyPair(alg: SigningAlg, modulusLength = 2048): Promise<KeyPairResult> {
  const isEc = alg.startsWith("ES");
  const algorithm: RsaHashedKeyGenParams | EcKeyGenParams = isEc
    ? { name: "ECDSA", namedCurve: EC_CURVES[alg] }
    : {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: HASH_FOR[alg],
      };

  const keyPair = await crypto.subtle.generateKey(algorithm, true, ["sign", "verify"]);
  const spki = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const publicKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privateKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);

  return {
    publicKeyPem: toPem(spki, "PUBLIC KEY"),
    privateKeyPem: toPem(pkcs8, "PRIVATE KEY"),
    publicKeyJwk,
    privateKeyJwk,
  };
}

// ---- RSA-OAEP asymmetric encryption ----

export interface RsaOaepKeyPair {
  publicKeyPem: string;
  privateKeyPem: string;
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export async function generateRsaOaepKeyPair(modulusLength = 2048): Promise<RsaOaepKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    { name: "RSA-OAEP", modulusLength, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["encrypt", "decrypt"],
  );
  const spki = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  return {
    publicKeyPem: toPem(spki, "PUBLIC KEY"),
    privateKeyPem: toPem(pkcs8, "PRIVATE KEY"),
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function rsaOaepEncrypt(plaintext: string, publicKey: CryptoKey): Promise<string> {
  const data = new TextEncoder().encode(plaintext);
  const cipherBuf = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data);
  return toStdBase64(new Uint8Array(cipherBuf));
}

export async function rsaOaepDecrypt(
  ciphertextB64: string,
  privateKey: CryptoKey,
): Promise<{ ok: true; plaintext: string } | { ok: false; error: string }> {
  try {
    const bytes = stdBase64ToBytes(ciphertextB64);
    const plainBuf = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, bytes as BufferSource);
    return { ok: true, plaintext: new TextDecoder().decode(plainBuf) };
  } catch {
    return { ok: false, error: "Decryption failed — check the ciphertext and that this is the matching private key." };
  }
}

export async function importRsaOaepPublicKeyFromPem(pem: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("spki", fromPem(pem), { name: "RSA-OAEP", hash: "SHA-256" }, true, ["encrypt"]);
}

export async function importRsaOaepPrivateKeyFromPem(pem: string): Promise<CryptoKey> {
  return crypto.subtle.importKey("pkcs8", fromPem(pem), { name: "RSA-OAEP", hash: "SHA-256" }, true, ["decrypt"]);
}
