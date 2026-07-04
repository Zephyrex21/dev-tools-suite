import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { generateApiKey } from "../../lib/crypto";

const CHARSETS = ["alphanumeric", "hex", "base62"] as const;

export default function ApiKeyGen() {
  const [prefix, setPrefix] = useState("sk_live_");
  const [length, setLength] = useState(32);
  const [charset, setCharset] = useState<(typeof CHARSETS)[number]>("alphanumeric");
  const [key, setKey] = useState("");

  function regenerate() {
    setKey(generateApiKey({ prefix, length, charset }));
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix, length, charset]);

  return (
    <div>
      <ToolHeader name="API Key Generator" description="Generate a random, prefixable API key." />
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                Prefix
              </label>
              <input
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="sk_live_"
                className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 font-mono text-[13px] text-[var(--color-ink)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                Length
              </label>
              <input
                type="number"
                min={8}
                max={128}
                value={length}
                onChange={(e) => setLength(Math.max(8, Math.min(128, Number(e.target.value) || 32)))}
                className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[13px] text-[var(--color-ink)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                Charset
              </label>
              <select
                value={charset}
                onChange={(e) => setCharset(e.target.value as (typeof CHARSETS)[number])}
                className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[13px] text-[var(--color-ink)]"
              >
                {CHARSETS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={regenerate}
            className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>

        <Panel label="API Key" value={key} readOnly minHeight="min-h-[80px]" showLineNumbers={false} downloadFilename="api-key.txt" />
      </div>
    </div>
  );
}
