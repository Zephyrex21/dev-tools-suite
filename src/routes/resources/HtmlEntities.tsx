import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { CopyButton } from "../../components/CopyButton";
import { COMMON_HTML_ENTITIES, encodeHtmlEntities, decodeHtmlEntities } from "../../lib/encoding";

export default function HtmlEntities() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState('<div class="card">Caf\u00e9 & Cr\u00e8me \u2014 \u00a95 \u2192 \u00a95</div>');

  const output = useMemo(
    () => (mode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input)),
    [mode, input],
  );

  return (
    <div>
      <ToolHeader name="HTML Entities" description="Encode/decode HTML entities, plus a reference table of common ones." />
      <div className="flex flex-col gap-4">
        <div className="inline-flex w-fit rounded-lg border border-[var(--color-border)] p-0.5">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                mode === m ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel label={mode === "encode" ? "Text / HTML" : "Encoded"} value={input} onChange={setInput} minHeight="min-h-[140px]" />
          <Panel label={mode === "encode" ? "Encoded" : "Decoded"} value={output} readOnly minHeight="min-h-[140px]" />
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
          <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Common entities reference
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            <table className="w-full text-[13px]">
              <thead className="sticky top-0 bg-[var(--color-surface)]">
                <tr className="border-b border-[var(--color-border)] text-left text-[11px] uppercase tracking-wide text-[var(--color-ink-faint)]">
                  <th className="px-4 py-2 font-semibold">Char</th>
                  <th className="px-4 py-2 font-semibold">Entity</th>
                  <th className="px-4 py-2 font-semibold">Numeric</th>
                  <th className="px-4 py-2 font-semibold">Description</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {COMMON_HTML_ENTITIES.map((e) => (
                  <tr key={e.entity} className="hover:bg-[var(--color-surface-2)]">
                    <td className="px-4 py-2 font-mono text-[15px] text-[var(--color-ink)]">{e.char}</td>
                    <td className="px-4 py-2 font-mono text-[var(--color-accent)]">{e.entity}</td>
                    <td className="px-4 py-2 font-mono text-[var(--color-ink-dim)]">{e.code}</td>
                    <td className="px-4 py-2 text-[var(--color-ink-dim)]">{e.description}</td>
                    <td className="px-4 py-2"><CopyButton value={e.entity} label="" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
