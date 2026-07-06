import { useRef, useState, type ReactNode } from "react";
import { UploadCloud } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { DownloadButton } from "./DownloadButton";
import { CodeArea } from "./CodeArea";

interface PanelProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rightSlot?: ReactNode;
  monospace?: boolean;
  minHeight?: string;
  error?: string;
  /** Enables JSON-aware color syntax highlighting (monospace panels only). */
  language?: "json";
  /** Defaults to the value of `monospace` — set false to hide the gutter on short single-line panels. */
  showLineNumbers?: boolean;
  /** Shows a Download button next to Copy when provided. */
  downloadFilename?: string;
}

export function Panel({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder,
  rightSlot,
  monospace = true,
  minHeight = "min-h-[220px]",
  error,
  language,
  showLineNumbers,
  downloadFilename,
}: PanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditable = !readOnly && !!onChange;

  function loadFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange?.(reader.result);
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }

  return (
    <div
      onDragOver={isEditable ? (e) => { e.preventDefault(); setIsDragging(true); } : undefined}
      onDragLeave={isEditable ? () => setIsDragging(false) : undefined}
      onDrop={isEditable ? handleDrop : undefined}
      className={`relative flex flex-col rounded-2xl border bg-[var(--color-surface)] shadow-[var(--shadow-card)] overflow-hidden transition-colors ${
        isDragging ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {rightSlot}
          {isEditable && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt,.jwt,.pem,.csv,.yaml,.yml,.xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) loadFile(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload a file"
                aria-label="Upload a file"
                className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
              >
                <UploadCloud size={13} />
              </button>
            </>
          )}
          {downloadFilename && <DownloadButton value={value} filename={downloadFilename} />}
          <CopyButton value={value} />
        </div>
      </div>

      {monospace ? (
        <div className={minHeight.replace(/^min-h-/, "h-")}>
          <CodeArea
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            placeholder={placeholder}
            highlight={language === "json"}
            showLineNumbers={showLineNumbers ?? true}
          />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          className={`focus-ring w-full flex-1 resize-none bg-transparent px-4 py-3 text-[13px] leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] font-sans ${minHeight}`}
        />
      )}

      {isDragging && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--color-accent-soft)]/90">
          <span className="text-[13px] font-semibold text-[var(--color-accent)]">Drop file to load</span>
        </div>
      )}

      {error && (
        <div className="border-t border-[var(--color-bad)]/20 bg-[var(--color-bad-soft)] px-4 py-2 text-xs text-[var(--color-bad)]">
          {error}
        </div>
      )}
    </div>
  );
}
