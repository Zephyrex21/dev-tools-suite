import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { generateLorem, type LoremUnit } from "../../lib/encoding";

const UNITS: LoremUnit[] = ["words", "sentences", "paragraphs"];

export default function LoremIpsum() {
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [asHtml, setAsHtml] = useState(false);
  const [rawOutput, setRawOutput] = useState("");

  function regenerate() {
    setRawOutput(generateLorem(unit, count, startWithLorem));
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, count, startWithLorem]);

  const output = asHtml
    ? unit === "paragraphs"
      ? rawOutput.split("\n\n").map((p) => `<p>${p}</p>`).join("\n")
      : `<p>${rawOutput}</p>`
    : rawOutput;

  return (
    <div>
      <ToolHeader name="Lorem Ipsum Generator" description="Generate placeholder text by words, sentences, or paragraphs." />
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
              {UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                    unit === u ? "bg-[var(--color-accent-strong)] text-white" : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-[var(--color-ink-dim)]">Count</label>
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="focus-ring w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[13px] text-[var(--color-ink)]"
              />
            </div>
            <label className="flex items-center gap-2 text-[13px] text-[var(--color-ink-dim)]">
              <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
              Start with "Lorem ipsum…"
            </label>
            <label className="flex items-center gap-2 text-[13px] text-[var(--color-ink-dim)]">
              <input type="checkbox" checked={asHtml} onChange={(e) => setAsHtml(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
              Wrap in &lt;p&gt; tags
            </label>
            <button
              type="button"
              onClick={regenerate}
              className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <RefreshCw size={14} /> Regenerate
            </button>
          </div>
        </div>

        <Panel label="Output" value={output} readOnly minHeight="min-h-[280px]" monospace={false} downloadFilename={asHtml ? "lorem.html" : "lorem.txt"} />
      </div>
    </div>
  );
}
