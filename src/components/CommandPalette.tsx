import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, CornerDownLeft } from "lucide-react";
import { categories, tools, type ToolMeta } from "../lib/tools";

const categoryLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]));

function fuzzyScore(query: string, tool: ToolMeta): number {
  const q = query.toLowerCase().trim();
  if (!q) return 1;
  const name = tool.name.toLowerCase();
  const desc = tool.description.toLowerCase();
  const cat = categoryLabel[tool.category].toLowerCase();
  if (name.startsWith(q)) return 100;
  if (name.includes(q)) return 80;
  if (cat.includes(q)) return 50;
  if (desc.includes(q)) return 30;
  return 0;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    return tools
      .map((t) => ({ tool: t, score: fuzzyScore(query, t) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.tool);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function go(tool: ToolMeta) {
    navigate(tool.path);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[activeIndex]) go(results[activeIndex]);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-raised)]">
        <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-4 py-3">
          <Search size={16} className="shrink-0 text-[var(--color-ink-faint)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools…"
            className="focus-ring w-full bg-transparent text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)]"
          />
          <kbd className="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-ink-faint)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-[var(--color-ink-dim)]">No tools match "{query}"</div>
          ) : (
            results.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => go(t)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === activeIndex ? "bg-[var(--color-accent-soft)]" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[13.5px] font-medium ${i === activeIndex ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"}`}>
                      {t.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-ink-faint)]">{categoryLabel[t.category]}</span>
                  </div>
                  <div className="truncate text-[12px] text-[var(--color-ink-dim)]">{t.description}</div>
                </div>
                {i === activeIndex ? (
                  <CornerDownLeft size={13} className="shrink-0 text-[var(--color-accent)]" />
                ) : (
                  <ArrowRight size={13} className="shrink-0 text-[var(--color-ink-faint)]" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
