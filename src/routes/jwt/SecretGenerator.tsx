import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { bytesToBase64Url } from "../../lib/base64url";

const BIT_SIZES = [128, 192, 256, 384, 512];

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function SecretGenerator() {
  const [bits, setBits] = useState(256);
  const [hex, setHex] = useState("");
  const [base64url, setBase64url] = useState("");

  function generate() {
    const bytes = crypto.getRandomValues(new Uint8Array(bits / 8));
    setHex(toHex(bytes));
    setBase64url(bytesToBase64Url(bytes));
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bits]);

  return (
    <div>
      <ToolHeader name="JWT Secret Generator" description="Generate a cryptographically random signing key." />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Key size
          </span>
          <div className="inline-flex flex-wrap rounded-lg border border-[var(--color-border)] p-0.5">
            {BIT_SIZES.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBits(b)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  bits === b
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {b}-bit
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={generate}
            className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
        </div>

        <Panel label="Base64URL (recommended)" value={base64url} readOnly minHeight="min-h-[80px]" />
        <Panel label="Hex" value={hex} readOnly minHeight="min-h-[80px]" />

        <p className="text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
          Generated with the Web Crypto API's CSPRNG, entirely on your device. Store this secret
          somewhere safe — anyone who has it can forge tokens signed with HS256/384/512.
        </p>
      </div>
    </div>
  );
}
