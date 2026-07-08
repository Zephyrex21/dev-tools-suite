import { useEffect, useRef, useState } from "react";
import { FileText, Type, UploadCloud, X, AlertTriangle } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { CopyButton } from "../../components/CopyButton";
import { useHashWorker } from "../../hooks/useHashWorker";
import type { HashAlgo } from "../../lib/crypto";

const ALGOS: HashAlgo[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];
const LARGE_FILE_WARNING_BYTES = 150 * 1024 * 1024; // 150 MB

const emptyHashes: Record<HashAlgo, string> = {
  MD5: "",
  "SHA-1": "",
  "SHA-256": "",
  "SHA-384": "",
  "SHA-512": "",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function HashGenerator() {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [input, setInput] = useState("The quick brown fox jumps over the lazy dog");
  const [hashes, setHashes] = useState<Record<HashAlgo, string>>(emptyHashes);

  const [file, setFile] = useState<File | null>(null);
  const [hashing, setHashing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const runHash = useHashWorker();
  const generationRef = useRef(0);

  useEffect(() => {
    if (mode !== "text") return;
    const generation = ++generationRef.current;
    setHashing(true);
    const timer = setTimeout(async () => {
      // Hashed off the main thread — a large pasted block of text (or the
      // hand-written MD5 loop specifically) would otherwise freeze the tab
      // for however long the computation takes.
      const buffer = new TextEncoder().encode(input).buffer as ArrayBuffer;
      const results = await runHash(buffer, ALGOS);
      if (generation === generationRef.current) {
        setHashes({ ...emptyHashes, ...results });
        setHashing(false);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [input, mode, runHash]);

  async function hashFile(f: File) {
    const generation = ++generationRef.current;
    setFile(f);
    setHashing(true);
    setHashes(emptyHashes);
    const buffer = await f.arrayBuffer();
    const results = await runHash(buffer, ALGOS);
    if (generation === generationRef.current) {
      setHashes({ ...emptyHashes, ...results });
      setHashing(false);
    }
  }

  function clearFile() {
    generationRef.current++;
    setFile(null);
    setHashes(emptyHashes);
    setHashing(false);
  }

  function switchMode(m: "text" | "file") {
    setMode(m);
    setHashes(emptyHashes);
    if (m === "text") setFile(null);
  }

  return (
    <div>
      <ToolHeader name="Hash Generator" description="Generate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 digests from text or a file." />
      <div className="flex flex-col gap-4">
        <div className="inline-flex w-fit rounded-lg border border-[var(--color-border)] p-0.5">
          {([
            { id: "text" as const, label: "Text", icon: Type },
            { id: "file" as const, label: "File", icon: FileText },
          ]).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => switchMode(m.id)}
              className={`focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                mode === m.id
                  ? "bg-[var(--color-accent-strong)] text-white"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              <m.icon size={13} /> {m.label}
            </button>
          ))}
        </div>

        {mode === "text" ? (
          <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[120px]" monospace={false} />
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) hashFile(f);
            }}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragging ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]" : "border-[var(--color-border)] bg-[var(--color-surface)]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) hashFile(f);
                e.target.value = "";
              }}
            />
            {file ? (
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full items-center justify-between gap-3 rounded-lg bg-[var(--color-surface-2)] px-4 py-2.5 text-left">
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium text-[var(--color-ink)]">{file.name}</div>
                    <div className="text-[12px] text-[var(--color-ink-dim)]">{formatBytes(file.size)}</div>
                  </div>
                  <button type="button" onClick={clearFile} className="focus-ring shrink-0 rounded-lg p-1.5 text-[var(--color-ink-faint)] hover:text-[var(--color-bad)]">
                    <X size={14} />
                  </button>
                </div>
                {file.size > LARGE_FILE_WARNING_BYTES && (
                  <div className="flex items-center gap-2 rounded-lg bg-[var(--color-warn-soft)] px-3 py-2 text-left text-[12px] text-[var(--color-warn)]">
                    <AlertTriangle size={13} className="shrink-0" />
                    Large file — this may take a while and use significant memory. The page will
                    stay responsive while it works (hashing runs on a background thread), but very
                    large files can still take a long time.
                  </div>
                )}
              </div>
            ) : (
              <>
                <UploadCloud size={22} className="text-[var(--color-ink-faint)]" />
                <p className="text-[13.5px] text-[var(--color-ink-dim)]">Drag a file here, or</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="focus-ring rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
                >
                  Choose a file
                </button>
                <p className="text-[11.5px] text-[var(--color-ink-faint)]">
                  Hashed entirely in your browser — the file is never uploaded anywhere.
                </p>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {ALGOS.map((algo) => (
            <div
              key={algo}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
                  {algo}
                </span>
                <CopyButton value={hashes[algo]} />
              </div>
              <div className="break-all px-4 py-3 font-mono text-[13px] text-[var(--color-ink)]">
                {hashing ? "Hashing…" : hashes[algo] || "—"}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[13px] leading-relaxed text-[var(--color-ink-dim)]">
          MD5 and SHA-1 are included for compatibility with legacy systems and checksums — they're
          not safe for passwords or any security-sensitive use. Prefer SHA-256 or better for anything
          new.
        </p>
      </div>
    </div>
  );
}
