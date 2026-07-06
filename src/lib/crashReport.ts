export interface CrashInfo {
  message: string;
  stack?: string;
  route: string;
  userAgent: string;
  timestamp: string;
}

export function collectCrashInfo(error: unknown, route: string): CrashInfo {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  return {
    message,
    stack,
    route,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };
}

export function formatCrashDetails(info: CrashInfo): string {
  return [
    `Message: ${info.message}`,
    `Route: ${info.route}`,
    `Time: ${info.timestamp}`,
    `Browser: ${info.userAgent}`,
    info.stack ? `\nStack:\n${info.stack}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

const REPO_ISSUES_URL = "https://github.com/Zephyrex21/dev-tools-suite/issues/new";

export function buildGitHubIssueUrl(info: CrashInfo): string {
  const title = `Crash: ${info.message.slice(0, 80)}`;
  const body = [
    "**What happened?**",
    "<!-- A sentence or two on what you were doing -->",
    "",
    "**Automatically collected details**",
    "```",
    formatCrashDetails(info),
    "```",
  ].join("\n");

  const params = new URLSearchParams({ title, body, labels: "bug" });
  return `${REPO_ISSUES_URL}?${params.toString()}`;
}
