import { useState } from "react";
import { KeyRound } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { generateSigningKeyPair, type SigningAlg, type KeyPairResult } from "../../lib/crypto";

const ALGS: SigningAlg[] = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512"];

const ALG_INFO: Record<SigningAlg, string> = {
  RS256: "RSASSA-PKCS1-v1_5, 2048-bit modulus, SHA-256",
  RS384: "RSASSA-PKCS1-v1_5, 2048-bit modulus, SHA-384",
  RS512: "RSASSA-PKCS1-v1_5, 2048-bit modulus, SHA-512",
  ES256: "ECDSA on curve P-256, SHA-256",
  ES384: "ECDSA on curve P-384, SHA-384",
  ES512: "ECDSA on curve P-521, SHA-512",
};

export default function RsaEcKeyGen() {
  const [alg, setAlg] = useState<SigningAlg>("RS256");
  const [format, setFormat] = useState<"pem" | "jwk">("pem");
  const [result, setResult] = useState<KeyPairResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleGenerate() {
    setGenerating(true);
    setError(undefined);
    try {
      const r = await generateSigningKeyPair(alg);
      setResult(r);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Key generation failed — this browser may not support this algorithm.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <ToolHeader
        name="RSA/EC Key Pair Generator"
        description="Generate a signing key pair for RS256/384/512 or ES256/384/512 — drop the public key straight into the JWT Validator."
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Algorithm
          </span>
          <div className="inline-flex flex-wrap rounded-lg border border-[var(--color-border)] p-0.5">
            {ALGS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAlg(a)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  alg === a
                    ? "bg-[var(--color-accent-strong)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <span className="ml-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Format
          </span>
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
            {(["pem", "jwk"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium uppercase transition-colors ${
                  format === f
                    ? "bg-[var(--color-accent-strong)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <KeyRound size={14} /> {generating ? "Generating…" : "Generate key pair"}
          </button>
        </div>

        <p className="text-[12.5px] text-[var(--color-ink-faint)]">{ALG_INFO[alg]}</p>

        {error && <Callout tone="bad">{error}</Callout>}

        {result && (
          <>
            <Panel
              label="Public key"
              value={format === "pem" ? result.publicKeyPem : JSON.stringify(result.publicKeyJwk, null, 2)}
              readOnly
              minHeight="min-h-[180px]"
              language={format === "jwk" ? "json" : undefined}
              downloadFilename={format === "pem" ? "public-key.pem" : "public-key.jwk.json"}
            />
            <Panel
              label="Private key"
              value={format === "pem" ? result.privateKeyPem : JSON.stringify(result.privateKeyJwk, null, 2)}
              readOnly
              minHeight="min-h-[220px]"
              language={format === "jwk" ? "json" : undefined}
              downloadFilename={format === "pem" ? "private-key.pem" : "private-key.jwk.json"}
            />
            <Callout tone="warn">
              The private key never leaves this browser tab, but treat it like any other secret —
              don't paste it somewhere it could be logged or cached.
            </Callout>
          </>
        )}
      </div>
    </div>
  );
}
