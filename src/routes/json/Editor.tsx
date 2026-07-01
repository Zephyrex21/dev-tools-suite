import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { JsonTree } from "../../components/JsonTree";
import { safeParse } from "../../lib/json";

const SAMPLE = JSON.stringify(
  {
    name: "Ada Lovelace",
    born: 1815,
    contributions: ["Analytical Engine notes", "First published algorithm"],
    profile: { field: "mathematics", active: true, mentor: null },
  },
  null,
  2,
);

export default function Editor() {
  const [input, setInput] = useState(SAMPLE);
  const parsed = useMemo(() => safeParse(input), [input]);

  return (
    <div>
      <ToolHeader name="Tree Editor" description="Browse JSON as a collapsible tree." />
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[380px]" />
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
          <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Tree
          </div>
          <div className="px-4">
            {parsed.ok ? (
              <JsonTree data={parsed.value} />
            ) : (
              <div className="py-4">
                <Callout tone="bad">{parsed.error}</Callout>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
