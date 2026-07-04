import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { validateJsonSyntax } from "../../lib/json";

const SAMPLE = '{\n  "name": "Ada Lovelace",\n  "born": 1815\n}';

export default function Validator() {
  const [input, setInput] = useState(SAMPLE);
  const result = useMemo(() => validateJsonSyntax(input), [input]);

  return (
    <div>
      <ToolHeader name="JSON Validator" description="Check JSON syntax and locate the exact error position." />
      <div className="flex flex-col gap-4">
        <Panel label="Input" value={input} onChange={setInput} minHeight="min-h-[320px]" language="json" />
        {result.valid ? (
          <Callout tone="good">Valid JSON.</Callout>
        ) : (
          <Callout tone="bad">
            {result.error}
            {result.line && ` — line ${result.line}, column ${result.column}`}
          </Callout>
        )}
      </div>
    </div>
  );
}
