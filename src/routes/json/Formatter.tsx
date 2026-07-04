import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { formatJson } from "../../lib/json";

const SAMPLE = '{"name":"Ada Lovelace","born":1815,"tags":["mathematician","writer"],"active":true}';

export default function Formatter() {
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState<2 | 4 | "tab">(2);
  const result = useMemo(() => formatJson(input, indent), [input, indent]);

  return (
    <div>
      <ToolHeader name="JSON Formatter" description="Pretty-print JSON with custom indentation." />
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Indent
          </span>
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
            {([2, 4, "tab"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setIndent(opt)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  indent === opt
                    ? "bg-[var(--color-accent-strong)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {opt === "tab" ? "Tab" : `${opt} spaces`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[320px]" language="json" />
          <Panel
            label="Formatted"
            value={result.ok ? result.value : ""}
            readOnly
            minHeight="min-h-[320px]"
            error={result.ok ? undefined : result.error}
            language="json"
            downloadFilename="formatted.json"
          />
        </div>
      </div>
    </div>
  );
}
