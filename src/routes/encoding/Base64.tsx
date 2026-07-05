import { useEffect, useMemo, useRef, useState } from "react";
import { UploadCloud, X, ImageIcon, Download } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { base64Encode, base64Decode, base64DecodeBytes, bytesToBase64, detectImageMime } from "../../lib/encoding";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function downloadBytes(bytes: Uint8Array, filename: string, mime: string) {
  const blob = new Blob([bytes.slice()], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Base64() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [source, setSource] = useState<"text" | "file">("text");
  const [input, setInput] = useState("Hello, world!");

  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadFile(f: File) {
    setFile(f);
    const buffer = await f.arrayBuffer();
    setFileBase64(bytesToBase64(new Uint8Array(buffer)));
  }

  const textOutput = useMemo(() => {
    if (mode === "encode") return { ok: true as const, value: base64Encode(input) };
    return base64Decode(input);
  }, [mode, input]);

  const decodedImage = useMemo(() => {
    if (mode !== "decode") return null;
    const bytesResult = base64DecodeBytes(input);
    if (!bytesResult.ok) return null;
    const mime = detectImageMime(bytesResult.value);
    return mime ? { bytes: bytesResult.value, mime } : null;
  }, [mode, input]);

  const decodedImageUrl = useMemo(() => {
    if (!decodedImage) return null;
    const blob = new Blob([decodedImage.bytes.slice()], { type: decodedImage.mime });
    return URL.createObjectURL(blob);
  }, [decodedImage]);

  useEffect(() => {
    return () => {
      if (decodedImageUrl) URL.revokeObjectURL(decodedImageUrl);
    };
  }, [decodedImageUrl]);

  function switchMode(m: "encode" | "decode") {
    setMode(m);
    setSource("text");
    setFile(null);
    setInput(m === "encode" ? "Hello, world!" : "SGVsbG8sIHdvcmxkIQ==");
  }

  return (
    <div>
      <ToolHeader name="Base64 Encoder/Decoder" description="Encode text or files to Base64, or decode Base64 back to text, files, or images." />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex w-fit rounded-lg border border-[var(--color-border)] p-0.5">
            {(["encode", "decode"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                  mode === m ? "bg-[var(--color-accent-strong)] text-white" : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {mode === "encode" && (
            <div className="inline-flex w-fit rounded-lg border border-[var(--color-border)] p-0.5">
              {(["text", "file"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(s)}
                  className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                    source === s ? "bg-[var(--color-accent-strong)] text-white" : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {mode === "encode" && source === "file" ? (
          <>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) loadFile(f);
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
                  if (f) loadFile(f);
                  e.target.value = "";
                }}
              />
              {file ? (
                <div className="flex w-full items-center gap-3">
                  {file.type.startsWith("image/") && (
                    <img src={URL.createObjectURL(file)} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-[var(--color-border)] object-cover" />
                  )}
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate text-[13.5px] font-medium text-[var(--color-ink)]">{file.name}</div>
                    <div className="text-[12px] text-[var(--color-ink-dim)]">{formatBytes(file.size)} · {file.type || "unknown type"}</div>
                  </div>
                  <button type="button" onClick={() => { setFile(null); setFileBase64(""); }} className="focus-ring shrink-0 rounded-lg p-1.5 text-[var(--color-ink-faint)] hover:text-[var(--color-bad)]">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud size={22} className="text-[var(--color-ink-faint)]" />
                  <p className="text-[13.5px] text-[var(--color-ink-dim)]">Drag any file here, or</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="focus-ring rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
                  >
                    Choose a file
                  </button>
                </>
              )}
            </div>
            <Panel label="Base64" value={fileBase64} readOnly minHeight="min-h-[220px]" showLineNumbers={false} downloadFilename="encoded.base64.txt" />
          </>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <Panel label={mode === "encode" ? "Text" : "Base64"} value={input} onChange={setInput} minHeight="min-h-[260px]" />
            <Panel
              label={mode === "encode" ? "Base64" : "Text"}
              value={textOutput.ok ? textOutput.value : ""}
              readOnly
              minHeight="min-h-[260px]"
              error={textOutput.ok ? undefined : textOutput.error}
            />
          </div>
        )}

        {mode === "decode" && decodedImage && decodedImageUrl && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
              <ImageIcon size={14} /> Detected image ({decodedImage.mime})
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <img src={decodedImageUrl} alt="Decoded" className="max-h-48 rounded-lg border border-[var(--color-border)] object-contain" />
              <button
                type="button"
                onClick={() => downloadBytes(decodedImage.bytes, `decoded.${decodedImage.mime.split("/")[1]}`, decodedImage.mime)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
              >
                <Download size={13} /> Download image
              </button>
            </div>
          </div>
        )}

        {mode === "decode" && !textOutput.ok && !decodedImage && (
          <Callout tone="info">
            If this Base64 represents an image (PNG, JPEG, GIF, or WebP), a preview will appear
            here automatically once it decodes to a recognizable format.
          </Callout>
        )}
      </div>
    </div>
  );
}
