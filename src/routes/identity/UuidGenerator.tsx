import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { generateUuid, isValidNamespace, NAMESPACES, type UuidVersion } from "../../lib/uuidgen";

const VERSIONS: { id: UuidVersion; label: string; desc: string }[] = [
  { id: "v4", label: "v4", desc: "Random" },
  { id: "v1", label: "v1", desc: "Timestamp-based" },
  { id: "v5", label: "v5", desc: "Name-based (SHA-1)" },
];

export default function UuidGenerator() {
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [name, setName] = useState("example.com");
  const [namespace, setNamespace] = useState<string>(NAMESPACES.DNS);
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const namespaceValid = isValidNamespace(namespace);

  function regenerate() {
    if (version === "v5" && !namespaceValid) {
      setUuids([]);
      return;
    }
    setUuids(Array.from({ length: count }, () => generateUuid(version, { name, namespace })));
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, name, namespace, count]);

  return (
    <div>
      <ToolHeader name="UUID Generator" description="Generate v1 (timestamp), v4 (random), or v5 (name-based) UUIDs." />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
            {VERSIONS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVersion(v.id)}
                title={v.desc}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  version === v.id
                    ? "bg-[var(--color-accent-strong)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[13px] text-[var(--color-ink-dim)]">Count</label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              className="focus-ring w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-[13px] text-[var(--color-ink)]"
            />
          </div>
          <button
            type="button"
            onClick={regenerate}
            className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>

        {version === "v5" && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 font-mono text-[13px] text-[var(--color-ink)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                  Namespace
                </label>
                <div className="flex gap-2">
                  <input
                    value={namespace}
                    onChange={(e) => setNamespace(e.target.value)}
                    className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 font-mono text-[13px] text-[var(--color-ink)]"
                  />
                </div>
                <div className="mt-1.5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNamespace(NAMESPACES.DNS)}
                    className="text-[11px] text-[var(--color-accent)] underline underline-offset-2"
                  >
                    Use DNS namespace
                  </button>
                  <button
                    type="button"
                    onClick={() => setNamespace(NAMESPACES.URL)}
                    className="text-[11px] text-[var(--color-accent)] underline underline-offset-2"
                  >
                    Use URL namespace
                  </button>
                </div>
              </div>
            </div>
            {!namespaceValid && <div className="mt-2"><Callout tone="bad">Namespace must be a valid UUID.</Callout></div>}
          </div>
        )}

        <Panel label={`${uuids.length} generated`} value={uuids.join("\n")} readOnly minHeight="min-h-[200px]" />
      </div>
    </div>
  );
}
