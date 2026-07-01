import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { safeParse, sortKeysDeep } from "../../lib/json";

const SAMPLE = '{\n  "zebra": 1,\n  "apple": { "orange": 2, "banana": 3 },\n  "mango": 4\n}';

export default function Sort() {
  const [input, setInput] = useState(SAMPLE);
  const result = useMemo(() => {
    const parsed = safeParse(input);
    if (!parsed.ok) return parsed;
    return { ok: true as const, value: JSON.stringify(sortKeysDeep(parsed.value), null, 2) };
  }, [input]);

  return (
    <div>
      <ToolHeader name="Sort Keys" description="Recursively sort object keys alphabetically." />
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[320px]" />
        <Panel
          label="Sorted"
          value={result.ok ? result.value : ""}
          readOnly
          minHeight="min-h-[320px]"
          error={result.ok ? undefined : result.error}
        />
      </div>
    </div>
  );
}
