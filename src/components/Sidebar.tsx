import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { categories, tools } from "../lib/tools";
import { categoryIcons } from "../lib/categoryIcons";

function useActiveCategory(): string {
  const { pathname } = useLocation();
  const active = tools.find((t) => t.path === pathname);
  return active?.category ?? categories[0].id;
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const activeCategory = useActiveCategory();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set([activeCategory]));

  useEffect(() => {
    setOpenCategories((prev) => new Set(prev).add(activeCategory));
  }, [activeCategory]);

  function toggle(id: string) {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <nav className="flex flex-col gap-1 px-3 py-5">
      {categories.map((cat) => {
        const isOpen = openCategories.has(cat.id);
        const catTools = tools.filter((t) => t.category === cat.id);
        const Icon = categoryIcons[cat.id];
        return (
          <div key={cat.id}>
            <button
              type="button"
              onClick={() => toggle(cat.id)}
              aria-expanded={isOpen}
              className="focus-ring flex w-full items-center justify-between rounded-lg px-3 py-2 text-left"
            >
              <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-faint)]">
                <Icon size={13} />
                {cat.label}
              </span>
              <ChevronDown
                size={13}
                className={`shrink-0 text-[var(--color-ink-faint)] transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="flex flex-col gap-0.5 pb-2">
                {catTools.map((t) => (
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
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-64 shrink-0 overflow-y-auto border-r border-[var(--color-border)] md:block">
      <SidebarContent />
    </aside>
  );
}
