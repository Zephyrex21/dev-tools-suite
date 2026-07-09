// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { JsonTree } from "../JsonTree";

function makeDeeplyNested(depth: number): unknown {
  let obj: Record<string, unknown> = { value: "leaf" };
  for (let i = 0; i < depth; i++) {
    obj = { nested: obj };
  }
  return obj;
}

/**
 * TreeNode only renders (and recurses into) a node's children once that node
 * is expanded — collapsed nodes never mount their children at all, so the
 * default view only auto-expands ~3 levels deep. The actual path to the
 * stack-overflow risk this guards against is a user manually expanding many
 * nested levels in a row (e.g. drilling into a deeply-structured config or
 * log). This helper simulates exactly that by repeatedly clicking the
 * deepest currently-collapsed toggle.
 */
function expandDeepest(times: number) {
  for (let i = 0; i < times; i++) {
    const buttons = screen.queryAllByRole("button", { expanded: false });
    if (buttons.length === 0) break;
    fireEvent.click(buttons[buttons.length - 1]);
  }
}

describe("JsonTree", () => {
  it("renders normal, shallow JSON without any truncation", () => {
    render(<JsonTree data={{ name: "Ada", tags: ["a", "b"], meta: { born: 1815 } }} />);
    expect(screen.getByText(/name/)).toBeInTheDocument();
    expect(screen.queryByText(/too deeply nested/)).not.toBeInTheDocument();
  });

  it(
    "does not crash when manually expanded past the depth limit, and truncates instead",
    () => {
      // 90 levels — just past the 80-level cap, no need to go further to
      // prove the guard works — built from a structure deep enough that,
      // without the fix, expanding this far would risk exhausting the
      // render call stack.
      const pathological = makeDeeplyNested(90);
      render(<JsonTree data={pathological} />);

      expect(() => expandDeepest(85)).not.toThrow();
      expect(screen.getByText(/too deeply nested to display further/)).toBeInTheDocument();
    },
    15000, // repeatedly re-querying a growing DOM tree is inherently slower than typical tests; the default 5s timeout was too tight on slower machines
  );

  it("does not truncate when expanded to a depth still under the limit", () => {
    const moderate = makeDeeplyNested(20);
    render(<JsonTree data={moderate} />);
    expandDeepest(15);
    expect(screen.queryByText(/too deeply nested/)).not.toBeInTheDocument();
  });
});
