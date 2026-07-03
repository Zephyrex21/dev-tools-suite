import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { generatePassword, estimateStrength, type PasswordOptions, type Strength } from "../../lib/password";

const strengthColor: Record<Strength, string> = {
  "very weak": "var(--color-bad)",
  weak: "var(--color-bad)",
  fair: "var(--color-warn)",
  strong: "var(--color-good)",
  "very strong": "var(--color-good)",
};

const strengthWidth: Record<Strength, string> = {
  "very weak": "20%",
  weak: "40%",
  fair: "60%",
  strong: "80%",
  "very strong": "100%",
};

export default function PasswordGenerator() {
  const [opts, setOpts] = useState<PasswordOptions>({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [password, setPassword] = useState("");

  function regenerate() {
    setPassword(generatePassword(opts));
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts]);

  const strength = estimateStrength(password);
  const toggles: { key: keyof PasswordOptions; label: string }[] = [
    { key: "uppercase", label: "Uppercase A-Z" },
    { key: "lowercase", label: "Lowercase a-z" },
    { key: "numbers", label: "Numbers 0-9" },
    { key: "symbols", label: "Symbols !@#$…" },
    { key: "excludeAmbiguous", label: "Exclude ambiguous (Il1O0)" },
  ];

  return (
    <div>
      <ToolHeader name="Password Generator" description="Generate strong random passwords with a live strength meter." />
      <div className="flex flex-col gap-4">
        <Panel label="Password" value={password} readOnly minHeight="min-h-[70px]" />

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            <span>Strength</span>
            <span style={{ color: strengthColor[strength.label] }} className="capitalize">
              {strength.label} · {strength.bitsOfEntropy} bits
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: strengthWidth[strength.label], background: strengthColor[strength.label] }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
              Length: {opts.length}
            </label>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={opts.length}
            onChange={(e) => setOpts((o) => ({ ...o, length: Number(e.target.value) }))}
            className="w-full accent-[var(--color-accent)]"
          />

          <div className="mt-4 flex flex-col gap-2">
            {toggles.map((t) => (
              <label key={t.key} className="flex items-center gap-2.5 text-[13.5px] text-[var(--color-ink)]">
                <input
                  type="checkbox"
                  checked={opts[t.key] as boolean}
                  onChange={(e) => setOpts((o) => ({ ...o, [t.key]: e.target.checked }))}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                {t.label}
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={regenerate}
            className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
