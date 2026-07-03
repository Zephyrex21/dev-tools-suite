import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { aesEncrypt, aesDecrypt } from "../../lib/crypto";

export default function SymmetricEncryption() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [passphrase, setPassphrase] = useState("correct-horse-battery-staple");

  const [plaintext, setPlaintext] = useState("The Analytical Engine has no pretensions whatever to originate anything.");
  const [encrypted, setEncrypted] = useState<{ ciphertext: string; iv: string; salt: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const [ciphertextIn, setCiphertextIn] = useState("");
  const [ivIn, setIvIn] = useState("");
  const [saltIn, setSaltIn] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [decryptError, setDecryptError] = useState<string | undefined>();

  async function handleEncrypt() {
    setBusy(true);
    const r = await aesEncrypt(plaintext, passphrase);
    setEncrypted(r);
    setBusy(false);
  }

  async function handleDecrypt() {
    setBusy(true);
    setDecryptError(undefined);
    const r = await aesDecrypt(ciphertextIn, passphrase, ivIn, saltIn);
    if (r.ok) setDecrypted(r.plaintext);
    else {
      setDecrypted("");
      setDecryptError(r.error);
    }
    setBusy(false);
  }

  function loadIntoDecrypt() {
    if (!encrypted) return;
    setCiphertextIn(encrypted.ciphertext);
    setIvIn(encrypted.iv);
    setSaltIn(encrypted.salt);
    setMode("decrypt");
  }

  return (
    <div>
      <ToolHeader
        name="Symmetric Encryption"
        description="Encrypt or decrypt text with AES-256-GCM, using a passphrase (PBKDF2-derived key)."
      />

      <div className="flex flex-col gap-4">
        <div className="inline-flex w-fit rounded-lg border border-[var(--color-border)] p-0.5">
          {(["encrypt", "decrypt"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                mode === m
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m === "encrypt" ? <Lock size={13} /> : <Unlock size={13} />}
              {m}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Passphrase
          </label>
          <input
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="focus-ring w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-[13px] text-[var(--color-ink)]"
          />
        </div>

        {mode === "encrypt" ? (
          <>
            <Panel label="Plaintext" value={plaintext} onChange={setPlaintext} minHeight="min-h-[140px]" monospace={false} />
            <button
              type="button"
              onClick={handleEncrypt}
              disabled={busy || !plaintext}
              className="focus-ring w-fit rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {busy ? "Encrypting…" : "Encrypt"}
            </button>

            {encrypted && (
              <>
                <Panel label="Ciphertext (base64)" value={encrypted.ciphertext} readOnly minHeight="min-h-[100px]" />
                <div className="grid gap-4 md:grid-cols-2">
                  <Panel label="IV (base64)" value={encrypted.iv} readOnly minHeight="min-h-[70px]" />
                  <Panel label="Salt (base64)" value={encrypted.salt} readOnly minHeight="min-h-[70px]" />
                </div>
                <Callout tone="info">
                  IV and salt aren't secret — store them alongside the ciphertext. You'll need
                  all three plus the passphrase to decrypt.{" "}
                  <button type="button" onClick={loadIntoDecrypt} className="font-semibold underline underline-offset-2">
                    Try decrypting it now →
                  </button>
                </Callout>
              </>
            )}
          </>
        ) : (
          <>
            <Panel label="Ciphertext (base64)" value={ciphertextIn} onChange={setCiphertextIn} minHeight="min-h-[100px]" />
            <div className="grid gap-4 md:grid-cols-2">
              <Panel label="IV (base64)" value={ivIn} onChange={setIvIn} minHeight="min-h-[70px]" />
              <Panel label="Salt (base64)" value={saltIn} onChange={setSaltIn} minHeight="min-h-[70px]" />
            </div>
            <button
              type="button"
              onClick={handleDecrypt}
              disabled={busy || !ciphertextIn || !ivIn || !saltIn}
              className="focus-ring w-fit rounded-lg bg-[var(--color-accent)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {busy ? "Decrypting…" : "Decrypt"}
            </button>

            {decryptError && <Callout tone="bad">{decryptError}</Callout>}
            {decrypted && <Panel label="Plaintext" value={decrypted} readOnly minHeight="min-h-[100px]" monospace={false} />}
          </>
        )}
      </div>
    </div>
  );
}
