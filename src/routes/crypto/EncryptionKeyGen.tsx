import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { generateRandomKey } from "../../lib/crypto";

const SIZES = [128, 192, 256];

export default function EncryptionKeyGen() {
  const [bits, setBits] = useState(256);
  const [key, setKey] = useState<{ hex: string; base64: string } | null>(null);

  useEffect(() => {
    setKey(generateRandomKey(bits));
  }, [bits]);

  return (
    <div>
      <ToolHeader name="Encryption Key Generator" description="Generate a random AES key for symmetric encryption." />
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            AES key size
          </span>
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
            {SIZES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBits(b)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  bits === b
                    ? "bg-[var(--color-accent-strong)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                AES-{b}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setKey(generateRandomKey(bits))}
            className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>

        <Panel label="Base64" value={key?.base64 ?? ""} readOnly minHeight="min-h-[80px]" />
        <Panel label="Hex" value={key?.hex ?? ""} readOnly minHeight="min-h-[80px]" />

        <p className="text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
          Generated with the Web Crypto CSPRNG. Use this as a raw AES-GCM key — for a
          passphrase-based flow instead, see the Symmetric Encryption tool.
        </p>
      </div>
    </div>
  );
}
