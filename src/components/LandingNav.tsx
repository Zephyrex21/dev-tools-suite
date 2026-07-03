import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import { categories } from "../lib/tools";
import { siteConfig } from "../lib/siteConfig";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { id: "features", label: "Features" },
  ...categories.map((c) => ({ id: c.id, label: c.label.replace(/ Tools$/, "").replace(/ & .*/, "") })),
  { id: "faq", label: "FAQ" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  function handleAnchorClick(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="focus-ring flex items-center gap-2 rounded-lg" onClick={() => handleAnchorClick("top")}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)] text-white">
            <ShieldCheck size={16} />
          </span>
          <span className="text-[16px] font-semibold tracking-tight text-[var(--color-ink)]">{siteConfig.name}</span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleAnchorClick(link.id)}
              className="focus-ring rounded text-[13.5px] font-medium text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link
            to="/app"
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Launch App <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-ink-dim)] lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-[var(--color-border)] px-4 py-3 lg:hidden">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleAnchorClick(link.id)}
              className="focus-ring rounded-lg px-2 py-2 text-left text-[14px] font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
