export interface ToolMeta {
  id: string;
  name: string;
  path: string;
  category: "jwt" | "json";
  description: string;
}

export const categories: { id: "jwt" | "json"; label: string }[] = [
  { id: "jwt", label: "JWT Tools" },
  { id: "json", label: "JSON Tools" },
];

export const tools: ToolMeta[] = [
  // JWT
  { id: "jwt-validator", name: "Validator", path: "/jwt/validator", category: "jwt", description: "Decode a token and verify its signature." },
  { id: "jwt-encode", name: "Encode", path: "/jwt/encode", category: "jwt", description: "Build and sign a token from header and payload." },
  { id: "jwt-formatter", name: "Header & Payload Formatter", path: "/jwt/formatter", category: "jwt", description: "Beautify and inspect token JSON." },
  { id: "jwt-secret", name: "Secret Generator", path: "/jwt/secret-generator", category: "jwt", description: "Generate a random signing key." },
  { id: "jwt-fuzzer", name: "Fuzzer", path: "/jwt/fuzzer", category: "jwt", description: "Generate mutated tokens for security testing." },
  // JSON
  { id: "json-formatter", name: "Formatter", path: "/json/formatter", category: "json", description: "Pretty-print JSON with custom indentation." },
  { id: "json-validator", name: "Validator", path: "/json/validator", category: "json", description: "Check JSON syntax and locate errors." },
  { id: "json-minifier", name: "Minifier", path: "/json/minifier", category: "json", description: "Strip whitespace to shrink payload size." },
  { id: "json-converter", name: "Converter", path: "/json/converter", category: "json", description: "Convert between JSON, YAML, XML and CSV." },
  { id: "json-schema", name: "Schema Validator", path: "/json/schema", category: "json", description: "Validate data against a JSON Schema." },
  { id: "json-path", name: "Path Finder", path: "/json/path", category: "json", description: "Query JSON with JSONPath expressions." },
  { id: "json-diff", name: "Diff Tool", path: "/json/diff", category: "json", description: "Compare two JSON documents." },
  { id: "json-generator", name: "Generator", path: "/json/generator", category: "json", description: "Generate sample JSON from a field spec." },
  { id: "json-sort", name: "Sort Keys", path: "/json/sort", category: "json", description: "Recursively sort object keys alphabetically." },
  { id: "json-escape", name: "Escape / Unescape", path: "/json/escape", category: "json", description: "Escape or unescape a JSON string value." },
  { id: "json-editor", name: "Tree Editor", path: "/json/editor", category: "json", description: "Browse JSON as a collapsible tree." },
];

export function toolByPath(path: string): ToolMeta | undefined {
  return tools.find((t) => t.path === path);
}
