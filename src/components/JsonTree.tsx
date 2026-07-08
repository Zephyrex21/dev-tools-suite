import { useState } from "react";
import { ChevronRight, AlertTriangle } from "lucide-react";

// Real-world JSON essentially never nests this deep (even deeply-structured
// API responses rarely exceed 15-20 levels) — this exists purely as a safety
// ceiling. JSON.parse itself can handle far deeper input than this without
// erroring, but recursively rendering a React component tree that deep can
// exhaust the call stack well before parsing does, since each render level
// costs far more stack space than a bare function call.
const MAX_RENDER_DEPTH = 80;

function valueColor(v: unknown): string {
  if (v === null) return "var(--color-ink-faint)";
  if (typeof v === "string") return "var(--color-sig)";
  if (typeof v === "number") return "var(--color-payload)";
  if (typeof v === "boolean") return "var(--color-header)";
  return "var(--color-ink)";
}

function renderPrimitive(v: unknown): string {
  if (v === null) return "null";
  if (typeof v === "string") return `"${v}"`;
  return String(v);
}

function TreeNode({ label, value, depth }: { label: string; value: unknown; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isObject = value !== null && typeof value === "object";
  const isArray = Array.isArray(value);
  const entries = isObject ? Object.entries(value as Record<string, unknown>) : [];

  if (depth >= MAX_RENDER_DEPTH && isObject) {
    return (
      <div
        className="flex items-center gap-1.5 py-0.5 font-mono text-[13px] text-[var(--color-warn)]"
        style={{ paddingLeft: depth * 16 }}
      >
        <AlertTriangle size={12} className="shrink-0" />
        <span>{label}: too deeply nested to display further ({entries.length} items truncated)</span>
      </div>
    );
  }

  if (!isObject) {
    return (
      <div className="flex items-start gap-1.5 py-0.5 font-mono text-[13px]" style={{ paddingLeft: depth * 16 }}>
        <span className="text-[var(--color-ink-dim)]">{label}:</span>
        <span style={{ color: valueColor(value) }}>{renderPrimitive(value)}</span>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${isArray ? "Array" : "Object"} ${label}, ${entries.length} items`}
        className="focus-ring flex w-full items-center gap-1 rounded py-0.5 font-mono text-[13px] hover:bg-[var(--color-surface-2)]"
        style={{ paddingLeft: depth * 16 }}
      >
        <ChevronRight size={12} className={`shrink-0 text-[var(--color-ink-faint)] transition-transform ${open ? "rotate-90" : ""}`} />
        <span className="text-[var(--color-ink-dim)]">{label}</span>
        <span className="text-[var(--color-ink-faint)]">
          {isArray ? `Array(${entries.length})` : `Object(${entries.length})`}
        </span>
      </button>
      {open &&
        entries.map(([k, v]) => <TreeNode key={k} label={isArray ? `[${k}]` : k} value={v} depth={depth + 1} />)}
    </div>
  );
}

export function JsonTree({ data }: { data: unknown }) {
  return (
    <div className="max-h-[420px] overflow-auto py-2">
      <TreeNode label="root" value={data} depth={0} />
    </div>
  );
}
