import { Link } from "react-router-dom";
import { Menu, Search, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar({ onMenuClick, onSearchClick }: { onMenuClick: () => void; onSearchClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="focus-ring -ml-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] md:hidden"
          >
            <Menu size={18} />
          </button>
          <Link to="/" className="focus-ring flex items-center gap-2 rounded-lg">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
              <ShieldCheck size={15} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-[var(--color-ink)]">
              DevKit
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={onSearchClick}
          className="focus-ring flex w-full max-w-xs items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink-dim)] sm:max-w-sm"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search tools…</span>
          <kbd className="rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] font-medium">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-[var(--color-border)] px-3 py-1 text-[11px] font-medium text-[var(--color-ink-dim)] lg:inline-block">
            Runs entirely in your browser
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
