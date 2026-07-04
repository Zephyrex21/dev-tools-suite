export type JsonTokenType = "key" | "string" | "number" | "boolean" | "null" | "punctuation" | "ws";

export interface JsonToken {
  text: string;
  type: JsonTokenType;
}

// Matches: quoted strings (with escapes), true/false, null, numbers, or single punctuation chars.
const TOKEN_RE = /"(?:\\u[0-9a-fA-F]{4}|\\.|[^"\\])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}[\],:]/g;

/**
 * Tokenizes a JSON-like string for syntax highlighting. Best-effort: works on
 * partial/invalid JSON too (e.g. while the user is still typing), since it
 * never throws — unmatched stretches are simply emitted as whitespace/plain text.
 */
export function tokenizeJson(text: string): JsonToken[] {
  const tokens: JsonToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: text.slice(lastIndex, match.index), type: "ws" });
    }

    const raw = match[0];
    let type: JsonTokenType;
    if (raw[0] === '"') {
      // A string is a "key" if the next non-whitespace character after it is a colon.
      const after = text.slice(TOKEN_RE.lastIndex).match(/^\s*(:)?/);
      type = after && after[1] === ":" ? "key" : "string";
    } else if (raw === "true" || raw === "false") {
      type = "boolean";
    } else if (raw === "null") {
      type = "null";
    } else if (/[{}[\],:]/.test(raw)) {
      type = "punctuation";
    } else {
      type = "number";
    }

    tokens.push({ text: raw, type });
    lastIndex = TOKEN_RE.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ text: text.slice(lastIndex), type: "ws" });
  }

  return tokens;
}
