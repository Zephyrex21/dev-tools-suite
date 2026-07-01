interface TokenStripProps {
  headerRaw: string;
  payloadRaw: string;
  signatureRaw: string;
}

function truncate(str: string, max = 28) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

const segments = [
  { key: "header" as const, label: "Header", color: "var(--color-header)", soft: "var(--color-header-soft)" },
  { key: "payload" as const, label: "Payload", color: "var(--color-payload)", soft: "var(--color-payload-soft)" },
  { key: "signature" as const, label: "Signature", color: "var(--color-sig)", soft: "var(--color-sig-soft)" },
];

export function TokenStrip({ headerRaw, payloadRaw, signatureRaw }: TokenStripProps) {
  const values = { header: headerRaw, payload: payloadRaw, signature: signatureRaw };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="flex flex-wrap items-stretch font-mono text-[13px]">
        {segments.map((seg, i) => (
          <div key={seg.key} className="flex min-w-0 flex-1 items-center">
            <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3" style={{ background: seg.soft }}>
              <span
                className="text-[10px] font-sans font-semibold uppercase tracking-wide"
                style={{ color: seg.color }}
              >
                {seg.label}
              </span>
              <span className="truncate" style={{ color: seg.color }} title={values[seg.key]}>
                {truncate(values[seg.key]) || "—"}
              </span>
            </div>
            {i < segments.length - 1 && (
              <span className="px-1 text-[var(--color-ink-faint)] font-bold select-none">.</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
