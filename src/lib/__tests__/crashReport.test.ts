// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { collectCrashInfo, formatCrashDetails, buildGitHubIssueUrl } from "../crashReport";

describe("collectCrashInfo", () => {
  it("extracts message and stack from a real Error", () => {
    const info = collectCrashInfo(new Error("boom"), "/jwt/validator");
    expect(info.message).toBe("boom");
    expect(info.stack).toBeTruthy();
    expect(info.route).toBe("/jwt/validator");
  });

  it("handles non-Error thrown values without crashing", () => {
    const info = collectCrashInfo("a plain string was thrown", "/app");
    expect(info.message).toBe("a plain string was thrown");
    expect(info.stack).toBeUndefined();
  });
});

describe("formatCrashDetails", () => {
  it("includes the message, route, and stack when present", () => {
    const info = collectCrashInfo(new Error("test error"), "/security/hash");
    const formatted = formatCrashDetails(info);
    expect(formatted).toContain("test error");
    expect(formatted).toContain("/security/hash");
  });
});

describe("buildGitHubIssueUrl", () => {
  it("produces a valid, properly encoded GitHub issue URL", () => {
    const info = collectCrashInfo(new Error("Cannot read properties of undefined"), "/jwt/encode");
    const url = buildGitHubIssueUrl(info);
    expect(url.startsWith("https://github.com/Zephyrex21/dev-tools-suite/issues/new?")).toBe(true);
    const parsed = new URL(url);
    expect(parsed.searchParams.get("title")).toContain("Cannot read properties");
    expect(parsed.searchParams.get("body")).toContain("/jwt/encode");
    expect(parsed.searchParams.get("labels")).toBe("bug");
  });

  it("truncates very long error messages in the title", () => {
    const info = collectCrashInfo(new Error("x".repeat(500)), "/app");
    const url = buildGitHubIssueUrl(info);
    const title = new URL(url).searchParams.get("title") ?? "";
    expect(title.length).toBeLessThan(120);
  });
});
