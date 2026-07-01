import { useEffect, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { encodeJwt, sampleHeader, samplePayload, type JwtAlg } from "../../lib/jwt";

const ALGS: JwtAlg[] = ["HS256", "HS384", "HS512"];

export default function Encode() {
  const [headerText, setHeaderText] = useState(JSON.stringify(sampleHeader(), null, 2));
  const [payloadText, setPayloadText] = useState(JSON.stringify(samplePayload(), null, 2));
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [alg, setAlg] = useState<JwtAlg>("HS256");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setHeaderText(JSON.stringify({ alg, typ: "JWT" }, null, 2));
  }, [alg]);

  async function handleGenerate() {
    setError(undefined);
    try {
      const header = JSON.parse(headerText);
      const payload = JSON.parse(payloadText);
      const t = await encodeJwt({ header, payload, secret, alg });
      setToken(t);
    } catch (err) {
      setToken("");
      setError(err instanceof Error ? err.message : "Could not build token — check the JSON above.");
    }
  }

  return (
    <div>
      <ToolHeader name="JWT Encode" description="Build and sign a token from a header, payload and secret." />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Algorithm
          </span>
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
            {ALGS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAlg(a)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  alg === a
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Header" value={headerText} onChange={setHeaderText} minHeight="min-h-[140px]" />
          <Panel label="Payload" value={payloadText} onChange={setPayloadText} minHeight="min-h-[140px]" />
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Signing secret
          </div>
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-[13px] text-[var(--color-ink)]"
          />
          <button
            type="button"
            onClick={handleGenerate}
            className="focus-ring mt-3 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Generate token
          </button>
          {error && (
            <div className="mt-3">
              <Callout tone="bad">{error}</Callout>
            </div>
          )}
        </div>

        {token && <Panel label="Signed token" value={token} readOnly minHeight="min-h-[100px]" />}
      </div>
    </div>
  );
}
