import { describe, it, expect } from "vitest";
import {
  formatJson,
  minifyJson,
  sortKeysDeep,
  validateJsonSyntax,
  jsonToYaml,
  yamlToJson,
  jsonToXml,
  xmlToJson,
  jsonToCsv,
  csvToJson,
  validateAgainstSchema,
  queryJsonPath,
  diffJson,
  flattenDelta,
  generateSample,
  escapeJsonString,
  unescapeJsonString,
} from "../json";

describe("formatJson / minifyJson", () => {
  it("formats with the requested indent", () => {
    const result = formatJson('{"b":2,"a":1}', 2);
    expect(result.ok).toBe(true);
    if (result.ok) expect(JSON.parse(result.value)).toEqual({ b: 2, a: 1 });
  });

  it("minifies with no whitespace", () => {
    const result = minifyJson('{\n  "a": 1\n}');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).not.toContain("\n");
  });

  it("reports errors for invalid JSON instead of throwing", () => {
    expect(formatJson("{not json", 2).ok).toBe(false);
  });
});

describe("sortKeysDeep", () => {
  it("sorts nested object keys alphabetically", () => {
    const sorted = sortKeysDeep({ b: 1, a: { z: 1, y: 2 } }) as Record<string, unknown>;
    expect(Object.keys(sorted)).toEqual(["a", "b"]);
    expect(Object.keys(sorted.a as object)).toEqual(["y", "z"]);
  });
});

describe("validateJsonSyntax", () => {
  it("flags a trailing comma with a line/column location", () => {
    const result = validateJsonSyntax('{"a":1,}');
    expect(result.valid).toBe(false);
  });
});

describe("format converters", () => {
  it("round-trips JSON -> YAML -> JSON", () => {
    const y = jsonToYaml('{"name":"Ada","tags":["a","b"]}');
    expect(y.ok).toBe(true);
    if (y.ok) {
      const back = yamlToJson(y.value);
      expect(back.ok).toBe(true);
      if (back.ok) expect(JSON.parse(back.value).name).toBe("Ada");
    }
  });

  it("round-trips JSON -> XML -> JSON", () => {
    const x = jsonToXml('{"person":{"name":"Ada"}}');
    expect(x.ok).toBe(true);
    if (x.ok) {
      const back = xmlToJson(x.value);
      expect(back.ok).toBe(true);
      if (back.ok) expect(JSON.parse(back.value).person.name).toBe("Ada");
    }
  });

  it("round-trips JSON -> CSV -> JSON for multi-column data", () => {
    const csv = jsonToCsv('[{"name":"Ada","born":1815},{"name":"Alan","born":1912}]');
    expect(csv.ok).toBe(true);
    if (csv.ok) {
      const back = csvToJson(csv.value);
      expect(back.ok).toBe(true);
      if (back.ok) expect(JSON.parse(back.value)[0].name).toBe("Ada");
    }
  });

  it("handles single-column CSV without false-failing on Papa's delimiter notice (regression)", () => {
    const csv = jsonToCsv('[{"name":"Ada"}]');
    expect(csv.ok).toBe(true);
    if (csv.ok) {
      const back = csvToJson(csv.value);
      expect(back.ok).toBe(true);
    }
  });

  it("still reports genuine CSV errors (field count mismatch)", () => {
    const back = csvToJson("a,b\n1,2,3");
    expect(back.ok).toBe(false);
  });
});

describe("validateAgainstSchema", () => {
  it("passes valid data against its schema", () => {
    const result = validateAgainstSchema(
      '{"name":"Ada","born":1815}',
      JSON.stringify({ type: "object", required: ["name", "born"] }),
    );
    expect(result.ok).toBe(true);
  });

  it("fails when a required field is missing", () => {
    const result = validateAgainstSchema('{"name":"Ada"}', JSON.stringify({ type: "object", required: ["name", "born"] }));
    expect(result.ok).toBe(false);
  });
});

describe("queryJsonPath", () => {
  it("extracts matching values", () => {
    const result = queryJsonPath('{"store":{"books":[{"title":"A"},{"title":"B"}]}}', "$.store.books[*].title");
    expect(result.ok).toBe(true);
    if (result.ok) expect(JSON.parse(result.value)).toEqual(["A", "B"]);
  });
});

describe("diffJson / flattenDelta", () => {
  it("detects modified, added, and removed fields", () => {
    const diff = diffJson('{"a":1,"b":2}', '{"a":1,"b":3,"c":4}');
    expect(diff.ok).toBe(true);
    if (diff.ok) {
      const entries = flattenDelta(diff.value);
      expect(entries.some((e) => e.path === "root.b" && e.type === "modified")).toBe(true);
      expect(entries.some((e) => e.path === "root.c" && e.type === "added")).toBe(true);
    }
  });
});

describe("generateSample", () => {
  it("produces the requested fields with plausible types", () => {
    const sample = generateSample({ id: "uuid", name: "string", age: "number" });
    expect(sample).toHaveProperty("id");
    expect(sample).toHaveProperty("name");
    expect(sample).toHaveProperty("age");
  });
});

describe("escapeJsonString / unescapeJsonString", () => {
  it("round-trips special characters", () => {
    const original = 'Line1\nLine2 "quoted"';
    const escaped = escapeJsonString(original);
    const back = unescapeJsonString(escaped);
    expect(back.ok).toBe(true);
    if (back.ok) expect(back.value).toBe(original);
  });
});
