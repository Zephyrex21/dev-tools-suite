import { NavLink } from "react-router-dom";
import { categories, tools } from "../lib/tools";

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6 px-3 py-5">
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
            {cat.label}
          </div>
          <div className="flex flex-col gap-0.5">
            {tools
              .filter((t) => t.category === cat.id)
              .map((t) => (
                <NavLink
                  key={t.id}
                  to={t.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `focus-ring rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                        : "text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                    }`
                  }
                >
                  {t.name}
                </NavLink>
              ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-60 shrink-0 overflow-y-auto border-r border-[var(--color-border)] md:block">
      <SidebarContent />
    </aside>
  );
}
