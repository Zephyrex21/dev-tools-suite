import { useEffect, useState } from "react";
import { AlertTriangle, X, ExternalLink } from "lucide-react";
import { collectCrashInfo, buildGitHubIssueUrl, type CrashInfo } from "../lib/crashReport";

export function GlobalErrorBanner() {
  const [crash, setCrash] = useState<CrashInfo | null>(null);

  useEffect(() => {
    function handleError(e: ErrorEvent) {
      setCrash(collectCrashInfo(e.error ?? e.message, window.location.pathname));
    }
    function handleRejection(e: PromiseRejectionEvent) {
      setCrash(collectCrashInfo(e.reason, window.location.pathname));
    }
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (!crash) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-4">
      <div className="flex w-full max-w-md items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-raised)]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-warn-soft)] text-[var(--color-warn)]">
          <AlertTriangle size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[var(--color-ink)]">Something went wrong</p>
          <p className="mt-0.5 truncate text-[12px] text-[var(--color-ink-dim)]">{crash.message}</p>
          <a
            href={buildGitHubIssueUrl(crash)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:underline"
          >
            <ExternalLink size={12} /> Report this
          </a>
        </div>
        <button
          type="button"
          onClick={() => setCrash(null)}
          aria-label="Dismiss"
          className="focus-ring shrink-0 rounded-lg p-1 text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
