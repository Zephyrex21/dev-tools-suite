import { useState } from "react";
import { Plus } from "lucide-react";

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--color-border)] py-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-[15px] font-medium text-[var(--color-ink)]">{question}</span>
        <Plus
          size={18}
          className={`shrink-0 text-[var(--color-ink-faint)] transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        />
      </button>
      <div className={`grid overflow-hidden transition-all duration-200 ${open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-dim)]">{answer}</p>
        </div>
      </div>
    </div>
  );
}
