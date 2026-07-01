import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { minifyJson } from "../../lib/json";

const SAMPLE = '{\n  "name": "Ada Lovelace",\n  "born": 1815,\n  "tags": ["mathematician", "writer"]\n}';

export default function Minifier() {
  const [input, setInput] = useState(SAMPLE);
  const result = useMemo(() => minifyJson(input), [input]);
  const savings =
    result.ok && input.length > 0
      ? Math.round((1 - result.value.length / input.length) * 100)
      : 0;

  return (
    <div>
      <ToolHeader name="JSON Minifier" description="Strip whitespace to shrink payload size." />
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[320px]" />
          <Panel
            label={result.ok ? `Minified — ${savings}% smaller` : "Minified"}
            value={result.ok ? result.value : ""}
            readOnly
            minHeight="min-h-[320px]"
            monospace
            error={result.ok ? undefined : result.error}
          />
        </div>
      </div>
    </div>
  );
}
