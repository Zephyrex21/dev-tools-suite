import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently ignore
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!value}
      className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] hover:border-[var(--color-border-strong)] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {copied ? <Check size={13} className="text-[var(--color-good)]" /> : <Copy size={13} />}
      {copied ? "Copied" : label}
    </button>
  );
}
