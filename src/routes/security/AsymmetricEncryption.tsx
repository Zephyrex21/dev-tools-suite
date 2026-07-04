import { useState } from "react";
import { KeyRound } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import {
  generateRsaOaepKeyPair,
  rsaOaepEncrypt,
  rsaOaepDecrypt,
  type RsaOaepKeyPair,
} from "../../lib/crypto";

export default function AsymmetricEncryption() {
  const [keyPair, setKeyPair] = useState<RsaOaepKeyPair | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | undefined>();

  const [plaintext, setPlaintext] = useState("Meet at the usual place, 9pm.");
  const [ciphertext, setCiphertext] = useState("");
  const [encryptError, setEncryptError] = useState<string | undefined>();

  const [ciphertextIn, setCiphertextIn] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [decryptError, setDecryptError] = useState<string | undefined>();

  async function handleGenerate() {
    setGenerating(true);
    setGenerateError(undefined);
    try {
      const kp = await generateRsaOaepKeyPair(2048);
      setKeyPair(kp);
      setCiphertext("");
      setDecrypted("");
    } catch (err) {
      setKeyPair(null);
      setGenerateError(err instanceof Error ? err.message : "Key generation failed — this browser may not support RSA-OAEP.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleEncrypt() {
    if (!keyPair) return;
    setEncryptError(undefined);
    try {
      const c = await rsaOaepEncrypt(plaintext, keyPair.publicKey);
      setCiphertext(c);
    } catch {
      setEncryptError(
        "Encryption failed — RSA-OAEP can only encrypt short messages (a few hundred bytes at most for a 2048-bit key). Try shorter text.",
      );
    }
  }

  async function handleDecrypt() {
    if (!keyPair) return;
    setDecryptError(undefined);
    const r = await rsaOaepDecrypt(ciphertextIn, keyPair.privateKey);
    if (r.ok) setDecrypted(r.plaintext);
    else {
      setDecrypted("");
      setDecryptError(r.error);
    }
  }

  return (
    <div>
      <ToolHeader
        name="Asymmetric Encryption"
        description="Generate an RSA-OAEP key pair, encrypt with the public key, decrypt with the private key."
      />

      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="focus-ring inline-flex w-fit items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <KeyRound size={14} /> {generating ? "Generating 2048-bit key pair…" : "Generate key pair"}
        </button>

        {generateError && <Callout tone="bad">{generateError}</Callout>}

        {keyPair && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Panel label="Public key" value={keyPair.publicKeyPem} readOnly minHeight="min-h-[160px]" />
              <Panel label="Private key" value={keyPair.privateKeyPem} readOnly minHeight="min-h-[160px]" />
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                Encrypt with public key
              </div>
              <Panel label="Plaintext" value={plaintext} onChange={setPlaintext} minHeight="min-h-[80px]" monospace={false} />
              <button
                type="button"
                onClick={handleEncrypt}
                disabled={!plaintext}
                className="focus-ring mt-3 w-fit rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Encrypt
              </button>
              {encryptError && (
                <div className="mt-3">
                  <Callout tone="bad">{encryptError}</Callout>
                </div>
              )}
              {ciphertext && (
                <div className="mt-3">
                  <Panel
                    label="Ciphertext (base64)"
                    value={ciphertext}
                    readOnly
                    minHeight="min-h-[80px]"
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setCiphertextIn(ciphertext)}
                        className="text-[12px] font-medium text-[var(--color-accent)] underline underline-offset-2"
                      >
                        Use below ↓
                      </button>
                    }
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                Decrypt with private key
              </div>
              <Panel label="Ciphertext (base64)" value={ciphertextIn} onChange={setCiphertextIn} minHeight="min-h-[80px]" />
              <button
                type="button"
                onClick={handleDecrypt}
                disabled={!ciphertextIn}
                className="focus-ring mt-3 w-fit rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Decrypt
              </button>
              {decryptError && (
                <div className="mt-3">
                  <Callout tone="bad">{decryptError}</Callout>
                </div>
              )}
              {decrypted && (
                <div className="mt-3">
                  <Panel label="Plaintext" value={decrypted} readOnly minHeight="min-h-[80px]" monospace={false} />
                </div>
              )}
            </div>

            <Callout tone="info">
              RSA-OAEP is designed for small payloads like keys or tokens, not bulk data — pair
              it with AES for encrypting larger content (encrypt the AES key with RSA, encrypt
              the data with AES).
            </Callout>
          </>
        )}
      </div>
    </div>
  );
}
