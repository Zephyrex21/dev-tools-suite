import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { queryJsonPath } from "../../lib/json";

const SAMPLE = JSON.stringify(
  {
    store: {
      books: [
        { title: "Structure and Interpretation of Computer Programs", price: 38 },
        { title: "The Pragmatic Programmer", price: 40 },
      ],
    },
  },
  null,
  2,
);

export default function Path() {
  const [input, setInput] = useState(SAMPLE);
  const [path, setPath] = useState("$.store.books[*].title");
  const result = useMemo(() => queryJsonPath(input, path), [input, path]);

  return (
    <div>
      <ToolHeader name="JSON Path Finder" description="Query a JSON document using JSONPath expressions." />
      <div className="flex flex-col gap-4">
        <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[260px]" language="json" />

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            JSONPath expression
          </label>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="$.store.books[*].title"
            className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-[13px] text-[var(--color-ink)]"
          />
        </div>

        <Panel
          label="Result"
          value={result.ok ? result.value : ""}
          readOnly
          minHeight="min-h-[200px]"
          error={result.ok ? undefined : result.error}
          language="json"
        />
      </div>
    </div>
  );
}
