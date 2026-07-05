import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { DownloadButton } from "../../components/DownloadButton";
import { parseUrl } from "../../lib/encoding";

const SAMPLE = "https://user:pass@example.com:8443/products/search?q=hello+world&category=books&sort=asc#results";

export default function UrlParser() {
  const [input, setInput] = useState(SAMPLE);
  const result = useMemo(() => parseUrl(input), [input]);

  const rows: [string, string][] = result.ok
    ? [
        ["Protocol", result.value.protocol],
        ["Host", result.value.host],
        ["Hostname", result.value.hostname],
        ["Port", result.value.port || "(default)"],
        ["Pathname", result.value.pathname || "/"],
        ["Search", result.value.search || "(none)"],
        ["Hash", result.value.hash || "(none)"],
        ...(result.value.username ? ([["Username", result.value.username]] as [string, string][]) : []),
        ...(result.value.password ? ([["Password", result.value.password]] as [string, string][]) : []),
      ]
    : [];

  return (
    <div>
      <ToolHeader name="URL Parser" description="Break a URL into its components and query parameters." />
      <div className="flex flex-col gap-4">
        <Panel label="URL" value={input} onChange={setInput} minHeight="min-h-[80px]" />

        {!result.ok ? (
          <Callout tone="bad">{result.error}</Callout>
        ) : (
          <>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                  Components
                </span>
                <DownloadButton value={JSON.stringify(result.value, null, 2)} filename="url-components.json" />
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {rows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-2.5">
                    <span className="text-[12.5px] font-medium text-[var(--color-ink-dim)]">{label}</span>
                    <span className="break-all font-mono text-[12.5px] text-[var(--color-ink)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.value.queryParams.length > 0 && (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden">
                <div className="border-b border-[var(--color-border)] px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                  Query parameters ({result.value.queryParams.length})
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {result.value.queryParams.map((p, i) => (
                    <div key={i} className="grid grid-cols-[120px_1fr] gap-3 px-4 py-2.5">
                      <span className="break-all font-mono text-[12.5px] font-medium text-[var(--color-accent)]">{p.key}</span>
                      <span className="break-all font-mono text-[12.5px] text-[var(--color-ink)]">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
