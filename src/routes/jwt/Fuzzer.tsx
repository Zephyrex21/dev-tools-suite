import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { CopyButton } from "../../components/CopyButton";
import { Callout } from "../../components/Callout";
import { fuzzJwt, parseJwt } from "../../lib/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.nmm0qepYRjhNji3O-jq8Pvcr7l_me1_bomw4EJucQCU";

const severityStyle: Record<string, string> = {
  high: "text-[var(--color-bad)] bg-[var(--color-bad-soft)]",
  warn: "text-[var(--color-warn)] bg-[var(--color-warn-soft)]",
  info: "text-[var(--color-accent)] bg-[var(--color-accent-soft)]",
};

export default function Fuzzer() {
  const [token, setToken] = useState(SAMPLE);
  const parsed = useMemo(() => parseJwt(token), [token]);
  const mutations = useMemo(() => (parsed.structureValid ? fuzzJwt(token) : []), [token, parsed.structureValid]);

  return (
    <div>
      <ToolHeader
        name="JWT Fuzzer"
        description="Generate mutated tokens covering common JWT attack vectors, for testing your own verifier."
      />

      <div className="flex flex-col gap-4">
        <Panel
          label="Base token"
          value={token}
          onChange={setToken}
          minHeight="min-h-[110px]"
          placeholder="Paste a valid JWT to mutate…"
        />

        {!parsed.structureValid ? (
          <Callout tone="warn">Paste a well-formed token above to generate mutations.</Callout>
        ) : (
          <>
            <Callout tone="info">
              Use these against your own systems only. Each mutation targets a specific verifier
              weakness — a secure implementation should reject all of them.
            </Callout>

            <div className="flex flex-col gap-3">
              {mutations.map((m) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-[13.5px] font-semibold text-[var(--color-ink)]">{m.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityStyle[m.severity]}`}
                    >
                      {m.severity}
                    </span>
                    <span className="ml-auto">
                      <CopyButton value={m.token} />
                    </span>
                  </div>
                  <p className="mb-2 text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
                    {m.description}
                  </p>
                  <code className="block truncate rounded-lg bg-[var(--color-surface-2)] px-3 py-2 font-mono text-[12px] text-[var(--color-ink-dim)]">
                    {m.token}
                  </code>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
