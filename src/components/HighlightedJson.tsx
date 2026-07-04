import { tokenizeJson, type JsonTokenType } from "../lib/jsonHighlight";

const tokenColor: Record<JsonTokenType, string> = {
  key: "var(--color-payload)",
  string: "var(--color-sig)",
  number: "var(--color-accent)",
  boolean: "var(--color-header)",
  null: "var(--color-ink-faint)",
  punctuation: "var(--color-ink-dim)",
  ws: "inherit",
};

export function HighlightedJson({ text }: { text: string }) {
  const tokens = tokenizeJson(text);
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} style={{ color: tokenColor[t.type] }}>
          {t.text}
        </span>
      ))}
    </>
  );
}
