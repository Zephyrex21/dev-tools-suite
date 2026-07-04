import { useRef } from "react";
import { HighlightedJson } from "./HighlightedJson";

const CODE_TEXT_CLASSES = "font-mono text-[13px] leading-relaxed whitespace-pre";

interface CodeAreaProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  highlight?: boolean;
  showLineNumbers?: boolean;
}

export function CodeArea({
  value,
  onChange,
  readOnly = false,
  placeholder,
  highlight = false,
  showLineNumbers = true,
}: CodeAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = Math.max(1, value.split("\n").length);

  function handleScroll(e: React.UIEvent<HTMLTextAreaElement>) {
    const t = e.currentTarget;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = t.scrollTop;
      highlightRef.current.scrollLeft = t.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = t.scrollTop;
    }
  }

  const gutter = showLineNumbers && (
    <div
      ref={readOnly ? undefined : gutterRef}
      className={`shrink-0 select-none overflow-hidden bg-[var(--color-surface)] px-3 py-3 text-right text-[var(--color-ink-faint)] ${CODE_TEXT_CLASSES} ${
        readOnly ? "sticky left-0 z-10" : ""
      }`}
      style={{ tabSize: 2 }}
      aria-hidden
    >
      {Array.from({ length: lineCount }, (_, i) => (
        <div key={i}>{i + 1}</div>
      ))}
    </div>
  );

  if (readOnly) {
    return (
      <div className="flex h-full overflow-auto">
        {gutter}
        <pre className={`flex-1 px-4 py-3 text-[var(--color-ink)] ${CODE_TEXT_CLASSES}`} style={{ tabSize: 2 }}>
          {value ? (
            highlight ? <HighlightedJson text={value} /> : value
          ) : (
            <span className="text-[var(--color-ink-faint)]">{placeholder}</span>
          )}
        </pre>
      </div>
    );
  }

  return (
    <div className="relative flex h-full overflow-hidden">
      {gutter}
      <div className="relative flex-1 overflow-hidden">
        {highlight && (
          <pre
            ref={highlightRef}
            aria-hidden
            className={`pointer-events-none absolute inset-0 overflow-hidden px-4 py-3 text-[var(--color-ink)] ${CODE_TEXT_CLASSES}`}
            style={{ tabSize: 2 }}
          >
            <HighlightedJson text={value} />
          </pre>
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          spellCheck={false}
          className={`focus-ring absolute inset-0 resize-none overflow-auto bg-transparent px-4 py-3 placeholder:text-[var(--color-ink-faint)] ${CODE_TEXT_CLASSES} ${
            highlight ? "text-transparent caret-[var(--color-ink)]" : "text-[var(--color-ink)]"
          }`}
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  );
}
