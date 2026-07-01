import type { ReactNode } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

type Tone = "good" | "bad" | "warn" | "info";

const toneConfig: Record<Tone, { icon: typeof Info; bg: string; fg: string }> = {
  good: { icon: CheckCircle2, bg: "var(--color-good-soft)", fg: "var(--color-good)" },
  bad: { icon: XCircle, bg: "var(--color-bad-soft)", fg: "var(--color-bad)" },
  warn: { icon: AlertTriangle, bg: "var(--color-warn-soft)", fg: "var(--color-warn)" },
  info: { icon: Info, bg: "var(--color-accent-soft)", fg: "var(--color-accent)" },
};

export function Callout({ tone, children }: { tone: Tone; children: ReactNode }) {
  const { icon: Icon, bg, fg } = toneConfig[tone];
  return (
    <div
      className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
      style={{ background: bg, color: fg }}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
