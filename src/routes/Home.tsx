import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { categories, tools } from "../lib/tools";
import { categoryIcons } from "../lib/categoryIcons";

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[12px] font-medium text-[var(--color-ink-dim)]">
          <ShieldCheck size={13} className="text-[var(--color-accent)]" />
          Free · Client-side · Nothing leaves your browser
        </span>
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--color-ink)] sm:text-[42px]">
          All {tools.length} tools,
          <br />
          one workspace.
        </h1>
        <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-[var(--color-ink-dim)]">
          Every tool runs locally — no uploads, no accounts, no rate limits.
          <span className="mt-1 block text-[13px] text-[var(--color-ink-faint)]">
            Press <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[11px]">⌘K</kbd> to jump to any tool.
          </span>
        </p>
      </div>

      {categories.map((cat) => {
        const Icon = categoryIcons[cat.id];
        return (
          <div key={cat.id} className="mb-10">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                <Icon size={14} />
              </span>
              <h2 className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
                {cat.label}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tools
                .filter((t) => t.category === cat.id)
                .map((t) => (
                  <Link
                    key={t.id}
                    to={t.path}
                    className="focus-ring group flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="text-[14px] font-semibold text-[var(--color-ink)]">{t.name}</div>
                      <div className="mt-0.5 text-[13px] text-[var(--color-ink-dim)]">{t.description}</div>
                    </div>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-[var(--color-ink-faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]"
                    />
                  </Link>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
