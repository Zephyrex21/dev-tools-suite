import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ToolHeader } from "../../components/ToolHeader";
import { Panel } from "../../components/Panel";
import {
  jsonToYaml,
  yamlToJson,
  jsonToXml,
  xmlToJson,
  jsonToCsv,
  csvToJson,
  type JsonResult,
} from "../../lib/json";

type Format = "yaml" | "xml" | "csv";

const converters: Record<Format, { to: (t: string) => JsonResult<string>; from: (t: string) => JsonResult<string> }> = {
  yaml: { to: jsonToYaml, from: yamlToJson },
  xml: { to: jsonToXml, from: xmlToJson },
  csv: { to: jsonToCsv, from: csvToJson },
};

const samples: Record<Format, string> = {
  yaml: '{\n  "name": "Ada Lovelace",\n  "born": 1815\n}',
  xml: '{\n  "person": { "name": "Ada Lovelace", "born": 1815 }\n}',
  csv: '[\n  { "name": "Ada Lovelace", "born": 1815 },\n  { "name": "Alan Turing", "born": 1912 }\n]',
};

export default function Converter() {
  const [format, setFormat] = useState<Format>("yaml");
  const [direction, setDirection] = useState<"toOther" | "fromOther">("toOther");
  const [input, setInput] = useState(samples.yaml);

  const result = useMemo(() => {
    const conv = converters[format];
    return direction === "toOther" ? conv.to(input) : conv.from(input);
  }, [format, direction, input]);

  function switchFormat(f: Format) {
    setFormat(f);
    setDirection("toOther");
    setInput(samples[f]);
  }

  function flipDirection() {
    setDirection((d) => (d === "toOther" ? "fromOther" : "toOther"));
    if (result.ok) setInput(result.value);
  }

  const label = format.toUpperCase();

  return (
    <div>
      <ToolHeader name="JSON Converter" description="Convert between JSON, YAML, XML and CSV." />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-dim)]">
            Format
          </span>
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-0.5">
            {(["yaml", "xml", "csv"] as Format[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => switchFormat(f)}
                className={`focus-ring rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  format === f
                    ? "bg-[var(--color-accent-strong)] text-white"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={flipDirection}
            className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] font-medium text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeftRight size={13} /> Swap direction
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Panel
            label={direction === "toOther" ? "JSON" : label}
            value={input}
            onChange={setInput}
            minHeight="min-h-[320px]"
            language={direction === "toOther" ? "json" : undefined}
            downloadFilename={direction === "toOther" ? "input.json" : `input.${format}`}
          />
          <Panel
            label={direction === "toOther" ? label : "JSON"}
            value={result.ok ? result.value : ""}
            readOnly
            minHeight="min-h-[320px]"
            error={result.ok ? undefined : result.error}
            language={direction === "toOther" ? undefined : "json"}
            downloadFilename={direction === "toOther" ? `output.${format}` : "output.json"}
          />
        </div>
      </div>
    </div>
  );
}
