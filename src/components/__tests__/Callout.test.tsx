// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Callout } from "../Callout";

describe("Callout", () => {
  it("uses role=alert (implicit assertive live region) for urgent tones", () => {
    render(<Callout tone="bad">Something failed</Callout>);
    expect(screen.getByRole("alert")).toHaveTextContent("Something failed");
  });

  it("uses role=alert for warnings too", () => {
    render(<Callout tone="warn">Careful</Callout>);
    expect(screen.getByRole("alert")).toHaveTextContent("Careful");
  });

  it("uses role=status (implicit polite live region) for informational tones", () => {
    render(<Callout tone="good">All good</Callout>);
    expect(screen.getByRole("status")).toHaveTextContent("All good");
  });

  it("uses role=status for info tone", () => {
    render(<Callout tone="info">FYI</Callout>);
    expect(screen.getByRole("status")).toHaveTextContent("FYI");
  });
});
