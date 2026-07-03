import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { categories, toolByPath } from "../lib/tools";

const categoryLabel = Object.fromEntries(categories.map((c) => [c.id, c.label]));

export function ToolHeader({ name, description }: { name: string; description: string }) {
  const { pathname } = useLocation();
  const tool = toolByPath(pathname);

  return (
    <div className="mb-6">
      {tool && (
        <div className="mb-2 flex items-center gap-1.5 text-[12.5px] text-[var(--color-ink-faint)]">
          <Link to="/app" className="hover:text-[var(--color-ink-dim)]">
            DevKit
          </Link>
          <ChevronRight size={12} />
          <span>{categoryLabel[tool.category]}</span>
          <ChevronRight size={12} />
          <span className="text-[var(--color-ink-dim)]">{tool.name}</span>
        </div>
      )}
      <h1 className="text-[26px] font-semibold tracking-tight text-[var(--color-ink)]">{name}</h1>
      <p className="mt-1 text-[15px] text-[var(--color-ink-dim)]">{description}</p>
    </div>
  );
}
