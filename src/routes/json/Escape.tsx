import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { escapeJsonString, unescapeJsonString } from "../../lib/json";

export default function Escape() {
  const [mode, setMode] = useState<"escape" | "unescape">("escape");
  const [input, setInput] = useState('Line one\nLine two "quoted"');

  const output = useMemo(() => {
    if (mode === "escape") return { ok: true as const, value: escapeJsonString(input) };
    return unescapeJsonString(input);
  }, [mode, input]);

  return (
    <div>
      <ToolHeader name="Escape / Unescape" description="Escape or unescape a JSON string value." />
      <div className="flex flex-col gap-4">
        <div className="inline-flex w-fit rounded-lg border border-[var(--color-border)] p-0.5">
          {(["escape", "unescape"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                mode === m
                  ? "bg-[var(--color-accent-strong)] text-white"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[260px]" monospace={false} />
          <Panel
            label="Output"
            value={output.ok ? output.value : ""}
            readOnly
            minHeight="min-h-[260px]"
            error={output.ok ? undefined : output.error}
          />
        </div>
      </div>
    </div>
  );
}
