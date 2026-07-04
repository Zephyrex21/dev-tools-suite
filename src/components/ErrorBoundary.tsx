import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Kept as a single console line rather than swallowed — this is the only
    // signal a developer gets if a tool crashes in production.
    console.error("DevKit tool crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-bad-soft)] text-[var(--color-bad)]">
            <AlertTriangle size={22} />
          </span>
          <div>
            <h2 className="text-[17px] font-semibold text-[var(--color-ink)]">This tool hit an error</h2>
            <p className="mt-1 max-w-sm text-[13.5px] text-[var(--color-ink-dim)]">
              {this.state.error.message || "Something went wrong rendering this page."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-strong)] px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RotateCcw size={14} /> Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
