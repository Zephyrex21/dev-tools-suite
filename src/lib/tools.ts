export interface ToolMeta {
  id: string;
  name: string;
  path: string;
  category: "jwt" | "json" | "crypto" | "security" | "identity" | "encoding" | "resources";
  description: string;
}

export const categories: { id: ToolMeta["category"]; label: string; blurb: string }[] = [
  {
    id: "jwt",
    label: "JWT Tools",
    blurb: "Decode, verify, build, and stress-test JSON Web Tokens — including a fuzzer covering real attack vectors like alg confusion and jku injection.",
  },
  {
    id: "json",
    label: "JSON Tools",
    blurb: "Format, validate, convert, diff, and query JSON. Everything from a JSONPath finder to a full Ajv-powered schema validator.",
  },
  {
    id: "crypto",
    label: "Cryptographic Key Generators",
    blurb: "Generate signing key pairs, AES keys, and API keys — all with the Web Crypto CSPRNG, entirely on-device.",
  },
  {
    id: "security",
    label: "Encryption & Security Tools",
    blurb: "Encrypt and decrypt with AES-GCM or RSA-OAEP, and generate MD5/SHA digests, without a server in the loop.",
  },
  {
    id: "identity",
    label: "Password & Identity Tools",
    blurb: "Strong random passwords with a real entropy meter, plus v1/v4/v5 UUID generation.",
  },
  {
    id: "encoding",
    label: "Data Encoding & Formatting",
    blurb: "Base64, percent-encoding, and a regex tester with live match highlighting.",
  },
  {
    id: "resources",
    label: "Web Resources & Content Tools",
    blurb: "Placeholder text, URL parsing, and an HTML entities reference — the small utilities you reach for constantly.",
  },
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

  // Cryptographic Key Generators
  { id: "crypto-rsa-ec", name: "RSA/EC Key Pair Generator", path: "/crypto/rsa-ec-keygen", category: "crypto", description: "Generate signing key pairs for RS256/ES256 (PEM & JWK)." },
  { id: "crypto-enc-key", name: "Encryption Key Generator", path: "/crypto/encryption-key", category: "crypto", description: "Generate a random AES key for symmetric encryption." },
  { id: "crypto-api-key", name: "API Key Generator", path: "/crypto/api-key", category: "crypto", description: "Generate a random, prefixable API key." },

  // Encryption & Security Tools
  { id: "security-symmetric", name: "Symmetric Encryption", path: "/security/symmetric", category: "security", description: "Encrypt or decrypt text with AES-GCM and a passphrase." },
  { id: "security-asymmetric", name: "Asymmetric Encryption", path: "/security/asymmetric", category: "security", description: "Encrypt with an RSA public key, decrypt with the private key." },
  { id: "security-hash", name: "Hash Generator", path: "/security/hash", category: "security", description: "Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 digests." },

  // Password & Identity Tools
  { id: "identity-password", name: "Password Generator", path: "/identity/password", category: "identity", description: "Generate strong random passwords with a strength meter." },
  { id: "identity-uuid", name: "UUID Generator", path: "/identity/uuid", category: "identity", description: "Generate v1 (timestamp), v4 (random), or v5 (name-based) UUIDs." },

  // Data Encoding & Formatting
  { id: "encoding-base64", name: "Base64 Encoder/Decoder", path: "/encoding/base64", category: "encoding", description: "Encode text to Base64 or decode it back." },
  { id: "encoding-url", name: "URL Encoder/Decoder", path: "/encoding/url", category: "encoding", description: "Percent-encode or decode text and URLs." },
  { id: "encoding-regex", name: "Regex Tester", path: "/encoding/regex", category: "encoding", description: "Test a regex against text with live match highlighting." },

  // Web Resources & Content Tools
  { id: "resources-lorem", name: "Lorem Ipsum Generator", path: "/resources/lorem-ipsum", category: "resources", description: "Generate placeholder text by words, sentences, or paragraphs." },
  { id: "resources-url-parser", name: "URL Parser", path: "/resources/url-parser", category: "resources", description: "Break a URL into its components and query parameters." },
  { id: "resources-html-entities", name: "HTML Entities", path: "/resources/html-entities", category: "resources", description: "Encode/decode HTML entities, plus a reference table." },
];

export function toolByPath(path: string): ToolMeta | undefined {
  return tools.find((t) => t.path === path);
}
