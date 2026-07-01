import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { categories, tools } from "../lib/tools";

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[12px] font-medium text-[var(--color-ink-dim)]">
          <ShieldCheck size={13} className="text-[var(--color-accent)]" />
          Free · Client-side · Nothing leaves your browser
        </span>
        <h1 className="text-[34px] font-bold tracking-tight text-[var(--color-ink)] sm:text-[42px]">
          Developer tools,
          <br />
          without the tab hoarding.
        </h1>
        <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-[var(--color-ink-dim)]">
          JWT and JSON utilities in one clean workspace. Every tool runs locally —
          no uploads, no accounts, no rate limits.
        </p>
      </div>

      {categories.map((cat) => (
        <div key={cat.id} className="mb-8">
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
            {cat.label}
          </h2>
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
      ))}
    </div>
  );
}
