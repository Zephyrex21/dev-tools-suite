import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { categories, firstToolInCategory } from "../lib/tools";
import { siteConfig } from "../lib/siteConfig";
import { ThemeToggle } from "./ThemeToggle";

export function LandingNav() {
  const [open, setOpen] = useState(false);

  function scrollToAnchor(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <a
          href="#top"
          className="focus-ring flex shrink-0 items-center gap-2 rounded-lg"
          onClick={(e) => {
            e.preventDefault();
            scrollToAnchor("top");
          }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent-strong)] text-white">
            <ShieldCheck size={16} />
          </span>
          <span className="text-[16px] font-semibold tracking-tight text-[var(--color-ink)]">{siteConfig.name}</span>
        </a>

        <nav className="hidden min-w-0 items-center gap-5 overflow-x-auto lg:flex">
          <button
            type="button"
            onClick={() => scrollToAnchor("features")}
            className="focus-ring shrink-0 whitespace-nowrap text-[13.5px] font-medium text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
          >
            Features
          </button>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={firstToolInCategory(cat.id).path}
              className="focus-ring shrink-0 whitespace-nowrap text-[13.5px] font-medium text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
            >
              {cat.shortLabel}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => scrollToAnchor("faq")}
            className="focus-ring shrink-0 whitespace-nowrap text-[13.5px] font-medium text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
          >
            FAQ
          </button>
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link
            to="/app"
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--color-accent-strong)] px-4 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-opacity hover:opacity-90"
          >
            Launch App <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--color-ink-dim)] lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[var(--color-border)] px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => scrollToAnchor("features")}
            className="focus-ring rounded-lg px-2 py-2 text-left text-[14px] font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
          >
            Features
          </button>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={firstToolInCategory(cat.id).path}
              onClick={() => setOpen(false)}
              className="focus-ring rounded-lg px-2 py-2 text-left text-[14px] font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
            >
              {cat.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => scrollToAnchor("faq")}
            className="focus-ring rounded-lg px-2 py-2 text-left text-[14px] font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
          >
            FAQ
          </button>
        </nav>
      )}
    </header>
  );
}
