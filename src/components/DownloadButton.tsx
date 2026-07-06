import { Download } from "lucide-react";

export function DownloadButton({ value, filename }: { value: string; filename: string }) {
  function handleDownload() {
    if (!value) return;
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!value}
      title="Download as file"
      aria-label="Download as file"
      className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download size={13} />
    </button>
  );
}
