import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { diffJson, flattenDelta, stringifyShort } from "../../lib/json";

const LEFT_SAMPLE = '{\n  "name": "Ada Lovelace",\n  "born": 1815,\n  "role": "mathematician"\n}';
const RIGHT_SAMPLE = '{\n  "name": "Ada Lovelace",\n  "born": 1815,\n  "role": "computer scientist",\n  "notable": "Analytical Engine"\n}';

const typeStyle: Record<string, { label: string; className: string }> = {
  added: { label: "added", className: "text-[var(--color-good)] bg-[var(--color-good-soft)]" },
  removed: { label: "removed", className: "text-[var(--color-bad)] bg-[var(--color-bad-soft)]" },
  modified: { label: "changed", className: "text-[var(--color-warn)] bg-[var(--color-warn-soft)]" },
  "array-changed": { label: "array changed", className: "text-[var(--color-accent)] bg-[var(--color-accent-soft)]" },
};

export default function Diff() {
  const [left, setLeft] = useState(LEFT_SAMPLE);
  const [right, setRight] = useState(RIGHT_SAMPLE);

  const diff = useMemo(() => diffJson(left, right), [left, right]);
  const entries = useMemo(() => {
    if (!diff.ok || !diff.value) return [];
    return flattenDelta(diff.value);
  }, [diff]);

  return (
    <div>
      <ToolHeader name="JSON Diff" description="Compare two JSON documents field by field." />
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Left (original)" value={left} onChange={setLeft} minHeight="min-h-[220px]" />
          <Panel label="Right (updated)" value={right} onChange={setRight} minHeight="min-h-[220px]" />
        </div>

        {!diff.ok ? (
          <Callout tone="bad">{diff.error}</Callout>
        ) : entries.length === 0 ? (
          <Callout tone="good">No differences — the documents are equivalent.</Callout>
        ) : (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
            <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
              {entries.length} change{entries.length === 1 ? "" : "s"}
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {entries.map((e, i) => (
                <div key={i} className="flex flex-col gap-1 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeStyle[e.type].className}`}
                    >
                      {typeStyle[e.type].label}
                    </span>
                    <code className="font-mono text-[12.5px] text-[var(--color-ink)]">{e.path}</code>
                  </div>
                  {e.type === "modified" && (
                    <div className="font-mono text-[12.5px] text-[var(--color-ink-dim)]">
                      <span className="text-[var(--color-bad)]">- {stringifyShort(e.oldValue)}</span>
                      <br />
                      <span className="text-[var(--color-good)]">+ {stringifyShort(e.newValue)}</span>
                    </div>
                  )}
                  {e.type === "added" && (
                    <div className="font-mono text-[12.5px] text-[var(--color-good)]">+ {stringifyShort(e.newValue)}</div>
                  )}
                  {e.type === "removed" && (
                    <div className="font-mono text-[12.5px] text-[var(--color-bad)]">- {stringifyShort(e.oldValue)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
