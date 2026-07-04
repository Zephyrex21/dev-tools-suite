import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { base64Encode, base64Decode } from "../../lib/encoding";

export default function Base64() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello, world!");

  const output = useMemo(() => {
    if (mode === "encode") return { ok: true as const, value: base64Encode(input) };
    return base64Decode(input);
  }, [mode, input]);

  return (
    <div>
      <ToolHeader name="Base64 Encoder/Decoder" description="Encode text to Base64 or decode Base64 back to text." />
      <div className="flex flex-col gap-4">
        <div className="inline-flex w-fit rounded-lg border border-[var(--color-border)] p-0.5">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                mode === m ? "bg-[var(--color-accent-strong)] text-white" : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Panel label={mode === "encode" ? "Text" : "Base64"} value={input} onChange={setInput} minHeight="min-h-[260px]" />
          <Panel
            label={mode === "encode" ? "Base64" : "Text"}
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
