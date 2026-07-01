import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { validateAgainstSchema } from "../../lib/json";

const SAMPLE_DATA = '{\n  "name": "Ada Lovelace",\n  "born": 1815\n}';
const SAMPLE_SCHEMA = JSON.stringify(
  {
    type: "object",
    required: ["name", "born"],
    properties: {
      name: { type: "string" },
      born: { type: "number" },
    },
  },
  null,
  2,
);

export default function Schema() {
  const [data, setData] = useState(SAMPLE_DATA);
  const [schema, setSchema] = useState(SAMPLE_SCHEMA);
  const result = useMemo(() => validateAgainstSchema(data, schema), [data, schema]);

  return (
    <div>
      <ToolHeader name="JSON Schema Validator" description="Validate a JSON document against a JSON Schema." />
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Data" value={data} onChange={setData} minHeight="min-h-[260px]" />
          <Panel label="Schema" value={schema} onChange={setSchema} minHeight="min-h-[260px]" />
        </div>
        {result.ok ? (
          <Callout tone="good">{result.value}</Callout>
        ) : (
          <Callout tone="bad">
            <pre className="whitespace-pre-wrap font-mono text-[12.5px]">{result.error}</pre>
          </Callout>
        )}
      </div>
    </div>
  );
}
