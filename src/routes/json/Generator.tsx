import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { generateSample } from "../../lib/json";

const TYPES = ["string", "number", "boolean", "date", "uuid", "email", "array", "null"] as const;

interface Field {
  key: string;
  type: (typeof TYPES)[number];
}

export default function Generator() {
  const [fields, setFields] = useState<Field[]>([
    { key: "id", type: "uuid" },
    { key: "name", type: "string" },
    { key: "email", type: "email" },
    { key: "active", type: "boolean" },
    { key: "createdAt", type: "date" },
  ]);
  const [count, setCount] = useState(1);

  const output = useMemo(() => {
    const spec = Object.fromEntries(fields.filter((f) => f.key).map((f) => [f.key, f.type]));
    const items = Array.from({ length: count }, () => generateSample(spec));
    return JSON.stringify(count === 1 ? items[0] : items, null, 2);
  }, [fields, count]);

  function updateField(i: number, patch: Partial<Field>) {
    setFields((fs) => fs.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }

  return (
    <div>
      <ToolHeader name="JSON Generator" description="Generate sample JSON data from a field spec." />
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
              Fields
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-[var(--color-ink-dim)]">Rows</label>
              <input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="focus-ring w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[13px] text-[var(--color-ink)]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {fields.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={f.key}
                  onChange={(e) => updateField(i, { key: e.target.value })}
                  placeholder="fieldName"
                  className="focus-ring flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 font-mono text-[13px] text-[var(--color-ink)]"
                />
                <select
                  value={f.type}
                  onChange={(e) => updateField(i, { type: e.target.value as Field["type"] })}
                  className="focus-ring rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1.5 text-[13px] text-[var(--color-ink)]"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setFields((fs) => fs.filter((_, idx) => idx !== i))}
                  aria-label="Remove field"
                  className="focus-ring rounded-lg p-1.5 text-[var(--color-ink-faint)] hover:text-[var(--color-bad)]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFields((fs) => [...fs, { key: "", type: "string" }])}
            className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
          >
            <Plus size={13} /> Add field
          </button>
        </div>

        <Panel label="Generated JSON" value={output} readOnly minHeight="min-h-[260px]" language="json" downloadFilename="generated.json" />
      </div>
    </div>
  );
}
