export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

// ---- Base64 ----

export function base64Encode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function base64Decode(text: string): Result<string> {
  try {
    const binary = atob(text.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return { ok: true, value: new TextDecoder().decode(bytes) };
  } catch {
    return { ok: false, error: "Invalid Base64 input." };
  }
}

// ---- URL encoding ----

export function urlEncode(text: string, component: boolean): string {
  return component ? encodeURIComponent(text) : encodeURI(text);
}

export function urlDecode(text: string, component: boolean): Result<string> {
  try {
    return { ok: true, value: component ? decodeURIComponent(text) : decodeURI(text) };
  } catch {
    return { ok: false, error: "Invalid percent-encoding in input." };
  }
}

// ---- Regex tester ----

export interface RegexMatch {
  match: string;
  index: number;
  groups: (string | undefined)[];
  namedGroups?: Record<string, string>;
}

export function testRegex(
  pattern: string,
  flags: string,
  text: string,
): Result<{ matches: RegexMatch[]; isMatch: boolean }> {
  let re: RegExp;
  try {
    re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Invalid regular expression." };
  }
  try {
    const matches: RegexMatch[] = [];
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = re.exec(text)) !== null && guard < 10_000) {
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
        namedGroups: m.groups,
      });
      if (m[0] === "") re.lastIndex++; // avoid infinite loop on zero-width matches
      guard++;
    }
    return { ok: true, value: { matches, isMatch: matches.length > 0 } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not evaluate regex." };
  }
}

// ---- Lorem Ipsum ----

const LOREM_WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut " +
  "labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris " +
  "nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse " +
  "cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui " +
  "officia deserunt mollit anim id est laborum"
).split(" ");

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(minWords = 6, maxWords = 16): string {
  const n = randomInt(minWords, maxWords);
  const words = Array.from({ length: n }, () => LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
  return capitalize(words.join(" ")) + ".";
}

export type LoremUnit = "words" | "sentences" | "paragraphs";

export function generateLorem(unit: LoremUnit, count: number, startWithLorem = true): string {
  if (unit === "words") {
    const words = Array.from({ length: count }, () => LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
    if (startWithLorem) {
      words[0] = "lorem";
      if (words.length > 1) words[1] = "ipsum";
    }
    return capitalize(words.join(" "));
  }
  if (unit === "sentences") {
    const sentences = Array.from({ length: count }, () => generateSentence());
    if (startWithLorem) sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    return sentences.join(" ");
  }
  // paragraphs
  const paragraphs = Array.from({ length: count }, () => {
    const sentenceCount = randomInt(4, 8);
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(" ");
  });
  if (startWithLorem) {
    paragraphs[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + paragraphs[0];
  }
  return paragraphs.join("\n\n");
}

// ---- URL parser ----

export interface ParsedUrl {
  href: string;
  protocol: string;
  username: string;
  password: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  queryParams: { key: string; value: string }[];
}

export function parseUrl(input: string): Result<ParsedUrl> {
  try {
    const u = new URL(input);
    const queryParams = Array.from(u.searchParams.entries()).map(([key, value]) => ({ key, value }));
    return {
      ok: true,
      value: {
        href: u.href,
        protocol: u.protocol,
        username: u.username,
        password: u.password,
        host: u.host,
        hostname: u.hostname,
        port: u.port,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        queryParams,
      },
    };
  } catch {
    return { ok: false, error: "Not a valid absolute URL (must include a scheme, e.g. https://)." };
  }
}

// ---- HTML entities ----

export const COMMON_HTML_ENTITIES: { char: string; entity: string; code: string; description: string }[] = [
  { char: "<", entity: "&lt;", code: "&#60;", description: "Less-than sign" },
  { char: ">", entity: "&gt;", code: "&#62;", description: "Greater-than sign" },
  { char: "&", entity: "&amp;", code: "&#38;", description: "Ampersand" },
  { char: '"', entity: "&quot;", code: "&#34;", description: "Double quote" },
  { char: "'", entity: "&apos;", code: "&#39;", description: "Single quote" },
  { char: "\u00a0", entity: "&nbsp;", code: "&#160;", description: "Non-breaking space" },
  { char: "\u00a9", entity: "&copy;", code: "&#169;", description: "Copyright sign" },
  { char: "\u00ae", entity: "&reg;", code: "&#174;", description: "Registered sign" },
  { char: "\u2122", entity: "&trade;", code: "&#8482;", description: "Trademark sign" },
  { char: "\u20ac", entity: "&euro;", code: "&#8364;", description: "Euro sign" },
  { char: "\u00a3", entity: "&pound;", code: "&#163;", description: "Pound sign" },
  { char: "\u00a5", entity: "&yen;", code: "&#165;", description: "Yen sign" },
  { char: "\u00b0", entity: "&deg;", code: "&#176;", description: "Degree sign" },
  { char: "\u00b1", entity: "&plusmn;", code: "&#177;", description: "Plus-minus sign" },
  { char: "\u00d7", entity: "&times;", code: "&#215;", description: "Multiplication sign" },
  { char: "\u00f7", entity: "&divide;", code: "&#247;", description: "Division sign" },
  { char: "\u2013", entity: "&ndash;", code: "&#8211;", description: "En dash" },
  { char: "\u2014", entity: "&mdash;", code: "&#8212;", description: "Em dash" },
  { char: "\u2018", entity: "&lsquo;", code: "&#8216;", description: "Left single quote" },
  { char: "\u2019", entity: "&rsquo;", code: "&#8217;", description: "Right single quote" },
  { char: "\u201c", entity: "&ldquo;", code: "&#8220;", description: "Left double quote" },
  { char: "\u201d", entity: "&rdquo;", code: "&#8221;", description: "Right double quote" },
  { char: "\u2026", entity: "&hellip;", code: "&#8230;", description: "Horizontal ellipsis" },
  { char: "\u2192", entity: "&rarr;", code: "&#8594;", description: "Right arrow" },
  { char: "\u2190", entity: "&larr;", code: "&#8592;", description: "Left arrow" },
];

/** Encode all non-ASCII and reserved characters using the DOM (covers the full named-entity set, not just the common table). */
export function encodeHtmlEntities(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML.replace(/[\u00A0-\u9999]/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}
