import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { urlEncode, urlDecode } from "../../lib/encoding";

export default function UrlEncode() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [component, setComponent] = useState(true);
  const [input, setInput] = useState("https://example.com/search?q=hello world&lang=en");

  const output = useMemo(() => {
    if (mode === "encode") return { ok: true as const, value: urlEncode(input, component) };
    return urlDecode(input, component);
  }, [mode, component, input]);

  return (
    <div>
      <ToolHeader name="URL Encoder/Decoder" description="Percent-encode or decode text and URLs." />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
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
          <label className="flex items-center gap-2 text-[13px] text-[var(--color-ink-dim)]">
            <input type="checkbox" checked={component} onChange={(e) => setComponent(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
            Component mode (encodes <code className="font-mono text-[12px]">&amp; ? / :</code> too)
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[220px]" monospace={false} />
          <Panel
            label="Output"
            value={output.ok ? output.value : ""}
            readOnly
            minHeight="min-h-[220px]"
            error={output.ok ? undefined : output.error}
          />
        </div>
      </div>
    </div>
  );
}
