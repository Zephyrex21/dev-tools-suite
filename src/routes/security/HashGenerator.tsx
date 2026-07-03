import { useEffect, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { CopyButton } from "../../components/CopyButton";
import { hashText, type HashAlgo } from "../../lib/crypto";

const ALGOS: HashAlgo[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export default function HashGenerator() {
  const [input, setInput] = useState("The quick brown fox jumps over the lazy dog");
  const [hashes, setHashes] = useState<Record<HashAlgo, string>>({
    MD5: "",
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(ALGOS.map(async (a) => [a, await hashText(input, a)] as const));
      if (!cancelled) setHashes(Object.fromEntries(entries) as Record<HashAlgo, string>);
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <div>
      <ToolHeader name="Hash Generator" description="Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 digests as you type." />
      <div className="flex flex-col gap-4">
        <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[120px]" monospace={false} />

        <div className="flex flex-col gap-3">
          {ALGOS.map((algo) => (
            <div
              key={algo}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                  {algo}
                </span>
                <CopyButton value={hashes[algo]} />
              </div>
              <div className="break-all px-4 py-3 font-mono text-[13px] text-[var(--color-ink)]">
                {hashes[algo] || "—"}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
          MD5 and SHA-1 are included for compatibility with legacy systems and checksums — they're
          not safe for passwords or any security-sensitive use. Prefer SHA-256 or better for anything
          new.
        </p>
      </div>
    </div>
  );
}
