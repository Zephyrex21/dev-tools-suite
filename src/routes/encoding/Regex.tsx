import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { testRegex } from "../../lib/encoding";

const FLAG_OPTIONS = [
  { flag: "g", label: "Global" },
  { flag: "i", label: "Case-insensitive" },
  { flag: "m", label: "Multiline" },
  { flag: "s", label: "Dotall" },
] as const;

const COMMON_PATTERNS = [
  { name: "Email", pattern: "\\b[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}\\b" },
  { name: "URL", pattern: "https?:\\/\\/[^\\s]+" },
  { name: "IPv4", pattern: "\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\b" },
  { name: "Hex color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b" },
  { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}" },
  { name: "ISO date", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { name: "UUID", pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}" },
] as const;

function highlight(text: string, matches: { match: string; index: number }[]) {
  if (matches.length === 0) return [text];
  const parts: (string | { match: string })[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    parts.push({ match: m.match || "\u200b" });
    cursor = m.index + m.match.length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export default function Regex() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact ada@example.com or alan.turing@bletchley.ac.uk for details.");

  const result = useMemo(() => testRegex(pattern, flags, text), [pattern, flags, text]);
  const parts = useMemo(
    () => (result.ok ? highlight(text, result.value.matches) : [text]),
    [result, text],
  );

  function toggleFlag(f: string) {
    setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));
  }

  return (
    <div>
      <ToolHeader name="Regex Tester" description="Test a regular expression against sample text with live match highlighting." />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {COMMON_PATTERNS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPattern(p.pattern)}
              className="focus-ring rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[12px] font-medium text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Pattern
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2">
            <span className="font-mono text-[13px] text-[var(--color-ink-faint)]">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              className="focus-ring w-full bg-transparent font-mono text-[13px] text-[var(--color-ink)]"
            />
            <span className="font-mono text-[13px] text-[var(--color-ink-faint)]">/{flags}</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-3">
            {FLAG_OPTIONS.map((f) => (
              <label key={f.flag} className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-dim)]">
                <input
                  type="checkbox"
                  checked={flags.includes(f.flag)}
                  onChange={() => toggleFlag(f.flag)}
                  className="h-3.5 w-3.5 accent-[var(--color-accent)]"
                />
                {f.label} ({f.flag})
              </label>
            ))}
          </div>
        </div>

        <Panel label="Test string" value={text} onChange={setText} minHeight="min-h-[140px]" monospace={false} />

        {!result.ok ? (
          <Callout tone="bad">{result.error}</Callout>
        ) : (
          <>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                {result.value.matches.length} match{result.value.matches.length === 1 ? "" : "es"}
              </div>
              <div className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[var(--color-ink)]">
                {parts.map((p, i) =>
                  typeof p === "string" ? (
                    <span key={i}>{p}</span>
                  ) : (
                    <mark key={i} className="rounded bg-[var(--color-accent-soft)] px-0.5 text-[var(--color-accent)]">
                      {p.match}
                    </mark>
                  ),
                )}
              </div>
            </div>

            {result.value.matches.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
                <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                  Match details
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {result.value.matches.map((m, i) => (
                    <div key={i} className="px-4 py-2.5 font-mono text-[12.5px]">
                      <span className="text-[var(--color-ink-dim)]">[{i}] @{m.index}:</span>{" "}
                      <span className="text-[var(--color-ink)]">{m.match || "(empty)"}</span>
                      {m.groups.length > 0 && (
                        <span className="text-[var(--color-ink-faint)]"> · groups: {JSON.stringify(m.groups)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
