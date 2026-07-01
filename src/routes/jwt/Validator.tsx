import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { TokenStrip } from "../../components/TokenStrip";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { parseJwt, verifyHmac, verifyAsymmetric, type VerifyResult } from "../../lib/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.nmm0qepYRjhNji3O-jq8Pvcr7l_me1_bomw4EJucQCU";

type Mode = "hmac" | "public-key";

export default function Validator() {
  const [token, setToken] = useState(SAMPLE);
  const [mode, setMode] = useState<Mode>("hmac");
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [publicKey, setPublicKey] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [checking, setChecking] = useState(false);

  const parsed = useMemo(() => parseJwt(token), [token]);

  async function handleVerify() {
    setChecking(true);
    setResult(null);
    const r = mode === "hmac" ? await verifyHmac(token, secret) : await verifyAsymmetric(token, publicKey);
    setResult(r);
    setChecking(false);
  }

  return (
    <div>
      <ToolHeader name="JWT Validator" description="Decode a token and verify its signature." />

      <div className="flex flex-col gap-4">
        <Panel
          label="Token"
          value={token}
          onChange={(v) => {
            setToken(v);
            setResult(null);
          }}
          minHeight="min-h-[110px]"
          placeholder="Paste a JWT here…"
        />

        <TokenStrip
          headerRaw={parsed.headerRaw}
          payloadRaw={parsed.payloadRaw}
          signatureRaw={parsed.signatureRaw}
        />

        {!parsed.structureValid && (
          <Callout tone="bad">Token doesn't have the expected header.payload.signature structure.</Callout>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Panel
            label="Header"
            value={parsed.headerError ? parsed.headerError : JSON.stringify(parsed.header, null, 2)}
            readOnly
            minHeight="min-h-[140px]"
          />
          <Panel
            label="Payload"
            value={parsed.payloadError ? parsed.payloadError : JSON.stringify(parsed.payload, null, 2)}
            readOnly
            minHeight="min-h-[140px]"
          />
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Verify signature
          </div>

          <div className="mb-3 inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
            {(["hmac", "public-key"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setResult(null);
                }}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  mode === m
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {m === "hmac" ? "HMAC secret" : "RSA/EC public key"}
              </button>
            ))}
          </div>

          {mode === "hmac" ? (
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Signing secret"
              className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-[13px] text-[var(--color-ink)]"
            />
          ) : (
            <textarea
              value={publicKey}
              onChange={(e) => setPublicKey(e.target.value)}
              placeholder={"-----BEGIN PUBLIC KEY-----\n…\n-----END PUBLIC KEY-----"}
              spellCheck={false}
              className="focus-ring min-h-[100px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-[13px] text-[var(--color-ink)]"
            />
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={checking || !token}
            className="focus-ring mt-3 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {checking ? "Verifying…" : "Verify signature"}
          </button>

          {result && (
            <div className="mt-4">
              {result.ok ? (
                <Callout tone="good">Signature is valid — the token was signed with this key.</Callout>
              ) : (
                <Callout tone="bad">{result.reason}</Callout>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
