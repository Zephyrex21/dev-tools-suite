import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import {
  generatePasswords,
  generateMemorablePassword,
  estimateStrength,
  estimateMemorableStrength,
  type PasswordOptions,
  type MemorableOptions,
  type Strength,
} from "../../lib/password";

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

type Mode = "random" | "memorable" | "pin";

export default function PasswordGenerator() {
  const [mode, setMode] = useState<Mode>("random");
  const [count, setCount] = useState(1);

  const [randomOpts, setRandomOpts] = useState<PasswordOptions>({
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [pinLength, setPinLength] = useState(6);
  const [memorableOpts, setMemorableOpts] = useState<MemorableOptions>({
    wordCount: 4,
    separator: "-",
    capitalize: true,
    includeNumber: true,
  });

  const [passwords, setPasswords] = useState<string[]>([]);

  function regenerate() {
    if (mode === "random") {
      setPasswords(generatePasswords(randomOpts, count));
    } else if (mode === "pin") {
      setPasswords(
        generatePasswords(
          { length: pinLength, uppercase: false, lowercase: false, numbers: true, symbols: false, excludeAmbiguous: false },
          count,
        ),
      );
    } else {
      setPasswords(Array.from({ length: count }, () => generateMemorablePassword(memorableOpts)));
    }
  }

  useEffect(() => {
    regenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, count, randomOpts, pinLength, memorableOpts]);

  const strength =
    mode === "memorable" ? estimateMemorableStrength(memorableOpts) : estimateStrength(passwords[0] ?? "");

  const toggles: { key: keyof PasswordOptions; label: string }[] = [
    { key: "uppercase", label: "Uppercase A-Z" },
    { key: "lowercase", label: "Lowercase a-z" },
    { key: "numbers", label: "Numbers 0-9" },
    { key: "symbols", label: "Symbols !@#$…" },
    { key: "excludeAmbiguous", label: "Exclude ambiguous (Il1O0)" },
  ];

  return (
    <div>
      <ToolHeader name="Password Generator" description="Generate strong random, memorable, or PIN passwords with a live strength meter." />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
            {([
              { id: "random" as const, label: "Random" },
              { id: "memorable" as const, label: "Memorable" },
              { id: "pin" as const, label: "PIN" },
            ]).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  mode === m.id
                    ? "bg-[var(--color-accent-strong)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
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
        </div>

        <Panel
          label={count === 1 ? "Password" : `${count} passwords`}
          value={passwords.join("\n")}
          readOnly
          minHeight={count === 1 ? "min-h-[70px]" : "min-h-[200px]"}
          showLineNumbers={count > 1}
          downloadFilename="passwords.txt"
        />

        {count === 1 && (
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
        )}

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          {mode === "random" && (
            <>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                Length: {randomOpts.length}
              </label>
              <input
                type="range"
                min={6}
                max={64}
                value={randomOpts.length}
                onChange={(e) => setRandomOpts((o) => ({ ...o, length: Number(e.target.value) }))}
                className="w-full accent-[var(--color-accent)]"
              />
              <div className="mt-4 flex flex-col gap-2">
                {toggles.map((t) => (
                  <label key={t.key} className="flex items-center gap-2.5 text-[13.5px] text-[var(--color-ink)]">
                    <input
                      type="checkbox"
                      checked={randomOpts[t.key] as boolean}
                      onChange={(e) => setRandomOpts((o) => ({ ...o, [t.key]: e.target.checked }))}
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                    {t.label}
                  </label>
                ))}
              </div>
            </>
          )}

          {mode === "pin" && (
            <>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                Digits: {pinLength}
              </label>
              <input
                type="range"
                min={4}
                max={12}
                value={pinLength}
                onChange={(e) => setPinLength(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </>
          )}

          {mode === "memorable" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                  Words: {memorableOpts.wordCount}
                </label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={memorableOpts.wordCount}
                  onChange={(e) => setMemorableOpts((o) => ({ ...o, wordCount: Number(e.target.value) }))}
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                    Separator
                  </label>
                  <select
                    value={memorableOpts.separator}
                    onChange={(e) => setMemorableOpts((o) => ({ ...o, separator: e.target.value }))}
                    className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-[13px] text-[var(--color-ink)]"
                  >
                    <option value="-">Hyphen (-)</option>
                    <option value="_">Underscore (_)</option>
                    <option value=".">Dot (.)</option>
                    <option value=" ">Space</option>
                    <option value="">None</option>
                  </select>
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 text-[13px] text-[var(--color-ink-dim)]">
                    <input
                      type="checkbox"
                      checked={memorableOpts.capitalize}
                      onChange={(e) => setMemorableOpts((o) => ({ ...o, capitalize: e.target.checked }))}
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                    Capitalize
                  </label>
                  <label className="flex items-center gap-2 text-[13px] text-[var(--color-ink-dim)]">
                    <input
                      type="checkbox"
                      checked={memorableOpts.includeNumber}
                      onChange={(e) => setMemorableOpts((o) => ({ ...o, includeNumber: e.target.checked }))}
                      className="h-4 w-4 accent-[var(--color-accent)]"
                    />
                    Add number
                  </label>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={regenerate}
            className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
