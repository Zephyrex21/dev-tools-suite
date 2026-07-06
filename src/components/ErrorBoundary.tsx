import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Copy, Check, ExternalLink } from "lucide-react";
import { collectCrashInfo, formatCrashDetails, buildGitHubIssueUrl, type CrashInfo } from "../lib/crashReport";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  crashInfo: CrashInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, crashInfo: null, copied: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const crashInfo = collectCrashInfo(error, window.location.pathname);
    // Kept as a real console entry — the only signal a developer gets in
    // production if they aren't watching the "Report on GitHub" link get used.
    console.error("DevKit tool crashed:", error, info.componentStack);
    this.setState({ crashInfo });
  }

  handleCopy = async () => {
    if (!this.state.crashInfo) return;
    try {
      await navigator.clipboard.writeText(formatCrashDetails(this.state.crashInfo));
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 1500);
    } catch {
      // clipboard API unavailable — silently ignore, the report link still works
    }
  };

  render() {
    if (this.state.error && this.state.crashInfo) {
      const { error, crashInfo, copied } = this.state;
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bad-soft)] text-[var(--color-bad)]">
            <AlertTriangle size={22} />
          </span>
          <div>
            <h2 className="text-[17px] font-semibold text-[var(--color-ink)]">This tool hit an error</h2>
            <p className="mt-1 max-w-sm text-[13.5px] text-[var(--color-ink-dim)]">
              {error.message || "Something went wrong rendering this page."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => this.setState({ error: null, crashInfo: null })}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <RotateCcw size={14} /> Try again
            </button>
            <button
              type="button"
              onClick={this.handleCopy}
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
            >
              {copied ? <Check size={14} className="text-[var(--color-good)]" /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy details"}
            </button>
            <a
              href={buildGitHubIssueUrl(crashInfo)}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
            >
              <ExternalLink size={14} /> Report on GitHub
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
