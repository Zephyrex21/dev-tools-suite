import * as yaml from "js-yaml";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import Papa from "papaparse";
import Ajv from "ajv";
import { JSONPath } from "jsonpath-plus";
import * as jsondiffpatch from "jsondiffpatch";

export type JsonResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function safeParse(text: string): JsonResult<unknown> {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid JSON" };
  }
}

export function formatJson(text: string, indent: number | "tab" = 2): JsonResult<string> {
  const parsed = safeParse(text);
  if (!parsed.ok) return parsed;
  const space = indent === "tab" ? "\t" : indent;
  return { ok: true, value: JSON.stringify(parsed.value, null, space) };
}

export function minifyJson(text: string): JsonResult<string> {
  const parsed = safeParse(text);
  if (!parsed.ok) return parsed;
  return { ok: true, value: JSON.stringify(parsed.value) };
}

export function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      out[key] = sortKeysDeep((value as Record<string, unknown>)[key]);
    }
    return out;
  }
  return value;
}

export function validateJsonSyntax(text: string): { valid: boolean; error?: string; line?: number; column?: number } {
  const result = safeParse(text);
  if (result.ok) return { valid: true };
  const match = /position (\d+)/.exec(result.error);
  if (match) {
    const pos = parseInt(match[1], 10);
    const upToPos = text.slice(0, pos);
    const line = (upToPos.match(/\n/g)?.length ?? 0) + 1;
    const column = pos - upToPos.lastIndexOf("\n");
    return { valid: false, error: result.error, line, column };
  }
  return { valid: false, error: result.error };
}

// ---- Converters ----

export function jsonToYaml(text: string): JsonResult<string> {
  const parsed = safeParse(text);
  if (!parsed.ok) return parsed;
  try {
    return { ok: true, value: yaml.dump(parsed.value, { indent: 2, lineWidth: -1 }) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not convert to YAML" };
  }
}

export function yamlToJson(text: string): JsonResult<string> {
  try {
    const parsed = yaml.load(text);
    return { ok: true, value: JSON.stringify(parsed, null, 2) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid YAML" };
  }
}

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const xmlBuilder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", format: true, indentBy: "  " });

export function jsonToXml(text: string): JsonResult<string> {
  const parsed = safeParse(text);
  if (!parsed.ok) return parsed;
  try {
    return { ok: true, value: xmlBuilder.build(parsed.value) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not convert to XML" };
  }
}

export function xmlToJson(text: string): JsonResult<string> {
  try {
    const parsed = xmlParser.parse(text);
    return { ok: true, value: JSON.stringify(parsed, null, 2) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid XML" };
  }
}

export function jsonToCsv(text: string): JsonResult<string> {
  const parsed = safeParse(text);
  if (!parsed.ok) return parsed;
  const rows = Array.isArray(parsed.value) ? parsed.value : [parsed.value];
  try {
    return { ok: true, value: Papa.unparse(rows as Record<string, unknown>[]) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not convert to CSV. Rows must be flat objects." };
  }
}

export function csvToJson(text: string): JsonResult<string> {
  const result = Papa.parse(text.trim(), { header: true, dynamicTyping: true, skipEmptyLines: true });
  if (result.errors.length > 0) {
    return { ok: false, error: result.errors[0].message };
  }
  return { ok: true, value: JSON.stringify(result.data, null, 2) };
}

// ---- Schema validation ----

const ajv = new Ajv({ allErrors: true, strict: false });

export function validateAgainstSchema(dataText: string, schemaText: string): JsonResult<string> {
  const data = safeParse(dataText);
  if (!data.ok) return { ok: false, error: `Data: ${data.error}` };
  const schema = safeParse(schemaText);
  if (!schema.ok) return { ok: false, error: `Schema: ${schema.error}` };
  try {
    const validate = ajv.compile(schema.value as object);
    const valid = validate(data.value);
    if (valid) return { ok: true, value: "✓ Data is valid against the schema." };
    const errors = (validate.errors ?? [])
      .map((e) => `${e.instancePath || "/"} ${e.message}`)
      .join("\n");
    return { ok: false, error: errors || "Data does not match schema." };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid schema" };
  }
}

// ---- JSONPath ----

export function queryJsonPath(dataText: string, path: string): JsonResult<string> {
  const data = safeParse(dataText);
  if (!data.ok) return data;
  try {
    const result = JSONPath({ path, json: data.value as object });
    return { ok: true, value: JSON.stringify(result, null, 2) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid JSONPath expression" };
  }
}

// ---- Diff ----

const differ = jsondiffpatch.create({ arrays: { detectMove: true } });

export function diffJson(leftText: string, rightText: string): JsonResult<jsondiffpatch.Delta | undefined> {
  const left = safeParse(leftText);
  if (!left.ok) return { ok: false, error: `Left: ${left.error}` };
  const right = safeParse(rightText);
  if (!right.ok) return { ok: false, error: `Right: ${right.error}` };
  try {
    const delta = differ.diff(left.value, right.value);
    return { ok: true, value: delta };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not diff" };
  }
}

export interface DiffEntry {
  path: string;
  type: "added" | "removed" | "modified" | "array-changed";
  oldValue?: unknown;
  newValue?: unknown;
}

function stringifyShort(value: unknown): string {
  if (value === undefined) return "undefined";
  const str = typeof value === "string" ? value : JSON.stringify(value);
  return str.length > 80 ? str.slice(0, 80) + "…" : str;
}

/** Walk a jsondiffpatch delta into a flat, human-readable list of changes. */
export function flattenDelta(delta: unknown, basePath = "root"): DiffEntry[] {
  if (delta == null) return [];

  if (Array.isArray(delta)) {
    if (delta.length === 1) return [{ path: basePath, type: "added", newValue: delta[0] }];
    if (delta.length === 2) return [{ path: basePath, type: "modified", oldValue: delta[0], newValue: delta[1] }];
    if (delta.length === 3 && delta[2] === 0) return [{ path: basePath, type: "removed", oldValue: delta[0] }];
    return [{ path: basePath, type: "array-changed" }];
  }

  if (typeof delta === "object") {
    const obj = delta as Record<string, unknown>;
    if (obj._t === "a") {
      const entries: DiffEntry[] = [];
      for (const [key, val] of Object.entries(obj)) {
        if (key === "_t") continue;
        const index = key.startsWith("_") ? key.slice(1) : key;
        entries.push(...flattenDelta(val, `${basePath}[${index}]`));
      }
      return entries;
    }
    return Object.entries(obj).flatMap(([key, val]) => flattenDelta(val, `${basePath}.${key}`));
  }

  return [];
}

export { stringifyShort };

// ---- Generator (infer sample JSON from a lightweight shape spec) ----

export function generateSample(spec: Record<string, string>): Record<string, unknown> {
  const gen: Record<string, () => unknown> = {
    string: () => "sample text",
    number: () => 42,
    boolean: () => true,
    date: () => new Date().toISOString(),
    uuid: () => crypto.randomUUID(),
    email: () => "user@example.com",
    array: () => ["item1", "item2"],
    null: () => null,
  };
  const out: Record<string, unknown> = {};
  for (const [key, type] of Object.entries(spec)) {
    out[key] = (gen[type] ?? gen.string)();
  }
  return out;
}

// ---- Escape / Unescape ----

export function escapeJsonString(text: string): string {
  return JSON.stringify(text).slice(1, -1);
}

export function unescapeJsonString(text: string): JsonResult<string> {
  try {
    return { ok: true, value: JSON.parse(`"${text}"`) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not unescape — check for unescaped quotes" };
  }
}
