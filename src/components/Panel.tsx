import type { ReactNode } from "react";
import { CopyButton } from "./CopyButton";

interface PanelProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rightSlot?: ReactNode;
  monospace?: boolean;
  minHeight?: string;
  error?: string;
}

export function Panel({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  rightSlot,
  monospace = true,
  minHeight = "min-h-[220px]",
  error,
}: PanelProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {rightSlot}
          <CopyButton value={value} />
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        spellCheck={false}
        className={`focus-ring w-full flex-1 resize-none bg-transparent px-4 py-3 text-[13px] leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] ${minHeight} ${
          monospace ? "font-mono" : "font-sans"
        }`}
      />
      {error && (
        <div className="border-t border-[var(--color-bad)]/20 bg-[var(--color-bad-soft)] px-4 py-2 text-xs text-[var(--color-bad)]">
          {error}
        </div>
      )}
    </div>
  );
}
