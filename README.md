<div align="center">

# DevKit

**Developer tools, without the tab hoarding.**

30 JWT, JSON, cryptography, and encoding utilities in one fast, client-side workspace.
Nothing you type is ever sent anywhere — every tool runs entirely in your browser.

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
[![CI](https://github.com/Zephyrex21/dev-tools-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/Zephyrex21/dev-tools-suite/actions/workflows/ci.yml)

**[Live demo →](https://dev-tools-suite-xi.vercel.app/)**

</div>

---

## Why

Every one of these tools already exists somewhere online — scattered across a
dozen ad-covered sites, each with its own tab, its own upload prompt, its own
"we value your privacy" banner. DevKit puts 30 of them in one place, with a
consistent interface, and a simple rule: **nothing leaves your browser.**
JWT decoding, AES encryption, RSA key generation, file hashing — all of it
runs on the Web Crypto API and client-side JS, not a server you have to trust.

## Features

- **30 tools across 7 categories** — JWT, JSON, cryptographic key generation,
  encryption & hashing, passwords & identity, encoding, and everyday web
  utilities. Full list [below](#tools).
- **100% client-side.** No backend, no accounts, no rate limits, no analytics.
  Open the network tab — nothing goes out.
- **JWT Fuzzer** — generates mutated tokens covering real attack vectors
  (`alg:none`, RS/HS confusion, `jku` injection, and more) for testing your
  own verifier.
- **File-aware tools** — hash a file by dragging it in, encode/decode
  images and arbitrary files to/from Base64 with live image preview, upload
  a `.json` file straight into any JSON tool.
- **Real JSON syntax highlighting and line numbers** — hand-written, zero
  dependencies, in every JSON/JWT panel.
- **Command palette** (`⌘K`) — jump to any tool instantly.
- **Cream light theme / warm dark theme** with a signature gold gradient
  accent, both tuned to pass WCAG AA contrast.
- **Download-as-file** everywhere it's useful — generated keys, encrypted
  bundles, formatted JSON, password lists.

## Screenshots

<div align="center">

**Homepage** — marketing landing page

<img src="docs/screenshots/screenshot-1.png" alt="DevKit homepage — hero section with the JWT Validator preview" width="800" />

<br /><br />

**In-app dashboard** — all 30 tools, organized by category, with ⌘K search

<img src="docs/screenshots/screenshot-2.png" alt="DevKit in-app dashboard showing the sidebar and JWT Tools category" width="800" />

<br /><br />

**JSON Formatter** — live syntax highlighting and line numbers

<img src="docs/screenshots/screenshot-3.png" alt="JSON Formatter tool with syntax-highlighted input and output panels" width="800" />

</div>

## Tools

<table>
<tr><th>JWT Tools</th><th>JSON Tools</th></tr>
<tr valign="top"><td>

- Validator (decode + verify, HMAC & RSA/EC)
- Encode (build & sign)
- Header & Payload Formatter
- Secret Generator
- Fuzzer (attack-vector mutations)

</td><td>

- Formatter
- Validator
- Minifier
- Converter (↔ YAML / XML / CSV)
- Schema Validator (Ajv)
- Path Finder (JSONPath)
- Diff Tool
- Generator
- Sort Keys
- Escape / Unescape
- Tree Editor

</td></tr>
<tr><th>Cryptographic Key Generators</th><th>Encryption & Security</th></tr>
<tr valign="top"><td>

- RSA/EC Key Pair Generator (RS/ES, PEM & JWK)
- Encryption Key Generator (AES)
- API Key Generator

</td><td>

- Symmetric Encryption (AES-256-GCM)
- Asymmetric Encryption (RSA-OAEP)
- Hash Generator (MD5/SHA-1/256/384/512, text or file)

</td></tr>
<tr><th>Password & Identity</th><th>Data Encoding</th></tr>
<tr valign="top"><td>

- Password Generator (random / memorable / PIN, bulk)
- UUID Generator (v1 / v4 / v5)

</td><td>

- Base64 (text, files, images)
- URL Encoder/Decoder
- Regex Tester (with common-pattern presets)

</td></tr>
<tr><th>Web Resources</th><th></th></tr>
<tr valign="top"><td>

- Lorem Ipsum Generator
- URL Parser
- HTML Entities

</td><td></td></tr>
</table>

## Tech stack

- **React 19 + TypeScript + Vite** — client-only, no SSR
- **React Router** — one URL per tool, lazy-loaded per route
- **Tailwind CSS v4** — design tokens in `src/index.css`, cream/dark themes
- **Web Crypto API** — all signing, encryption, and hashing
- **[`jose`](https://github.com/panva/jose)** — JWT sign/verify
- **`js-yaml`, `fast-xml-parser`, `papaparse`** — JSON converters
- **`ajv`** — JSON Schema validation
- **`jsonpath-plus`**, **`jsondiffpatch`** — path queries and diffing
- **`uuid`** — UUID v1/v4/v5
- MD5 and the JSON syntax highlighter are hand-written, not dependencies

## Getting started

```bash
git clone https://github.com/Zephyrex21/dev-tools-suite.git
cd dev-tools-suite
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # production build -> dist/
npm run preview    # serve the production build locally
npm run test        # run the Vitest suite (92 tests: lib/ logic + component tests)
npm run lint        # oxlint
```

No environment variables, no API keys, no backend to configure. CI (GitHub
Actions) runs lint, type-check + build, and the full test suite on every
push and pull request.

## Deploy

DevKit is a fully static site — any static host works.

- **Vercel** — `vercel deploy`, or connect the repo in the dashboard (Vite is
  auto-detected).
- **Netlify** — build command `npm run build`, publish directory `dist`.
- **Cloudflare Pages / GitHub Pages** — same build command and output
  directory.

## Project structure

```
src/
  components/    Layout, Sidebar, TopBar, Panel, CodeArea, TokenStrip, ...
  hooks/         useTheme (light/dark persistence)
  lib/           jwt.ts, json.ts, crypto.ts, md5.ts, password.ts, uuidgen.ts,
                 encoding.ts, jsonHighlight.ts — pure logic, no UI
  lib/__tests__/ Vitest suite for everything in lib/
  routes/
    Landing.tsx  Marketing homepage
    Home.tsx     In-app tool dashboard
    jwt/         5 tools
    json/        11 tools
    crypto/      3 tools
    security/    3 tools
    identity/    2 tools
    encoding/    3 tools
    resources/   3 tools
  App.tsx        Router config, lazy-loaded per route
vercel.json      SPA rewrite rule (required for direct links to any tool)
.github/workflows/ci.yml   Lint + build + test on push/PR
```

Every tool is one route component + one pure logic module in `lib/`. Adding a
new tool means: a function in `lib/`, a route component, one entry in
`lib/tools.ts` (powers the sidebar, dashboard, command palette, and search),
and one line in `App.tsx`.

## Testing

`src/lib/` — the pure logic layer with no UI — has a 92-test Vitest suite
covering every module: JWT encode/verify/fuzz, JSON conversions and
round-trips, AES/RSA encryption, hashing (including a from-scratch MD5
checked against Node's `crypto` module across every block-padding edge
case), password entropy math, UUID generation against RFC test vectors, the
JSON syntax tokenizer, and crash-report formatting. A few component tests
(`@testing-library/react`) cover things that need real rendering to verify,
like the JSON Tree Editor's depth-limit guard — that test simulates 120
actual clicks to prove a deeply-expanded tree truncates instead of crashing,
rather than just asserting the constant exists. Known test vectors are
pulled from Node's own `crypto` module or published RFCs, not hand-typed
from memory — several early drafts of these tests had hand-typed vectors
that were themselves wrong, which is exactly the failure mode this approach
avoids.

```bash
npm run test
```

CI runs this suite, lint, and a full build on every push and PR — see
`.github/workflows/ci.yml`.

## Hardening against pathological input

A few tools accept arbitrary, unbounded user input, which needed specific
protection beyond normal error handling:

- **Regex Tester** runs matching in a Web Worker with a 2-second timeout.
  A pattern like `(a+)+$` against a moderately long string triggers
  catastrophic backtracking — a single regex engine call that can hang for
  minutes, which JavaScript cannot interrupt from within the same thread.
  The worker gets forcibly terminated and respawned if it doesn't return in
  time, instead of freezing the tab.
- **Hash Generator** hashes files (and pasted text) in a Web Worker instead
  of on the main thread, since the hand-written MD5 implementation runs a
  synchronous loop with no yielding — on a large file this would otherwise
  block the entire UI for as long as it takes to finish.
- **JSON Tree Editor** caps recursion at 80 levels. `JSON.parse` itself
  comfortably handles far deeper nesting than that, but recursively
  *rendering* a React component tree that deep costs much more stack space
  per level and can exhaust the call stack before parsing ever would.

## Accessibility & error visibility

- Skip-to-content link, focus-trapped modals (command palette, mobile
  navigation drawer) with focus restored to the trigger on close, and
  `aria-expanded` on every disclosure widget (sidebar accordion, JSON tree).
- If a tool crashes, an error boundary (scoped per-route, so one tool
  crashing doesn't take down the rest of the app) shows what happened with a
  one-click "Report on GitHub" link — pre-filled with the error, route, and
  browser info, no auto-collection or third-party analytics involved.
- A lightweight global listener catches errors an error boundary structurally
  can't (uncaught promise rejections in event handlers) and surfaces the
  same reporting option via a dismissible banner instead of failing silently.

## License

[MIT](LICENSE) — do whatever you want with it.
