# DevKit — JWT & JSON Tools

A free, client-side developer tools suite. Every tool runs entirely in the
browser — nothing is ever sent to a server.

**v1 scope:** 5 JWT tools + 11 JSON tools (16 total). Encryption/key/password
tools are planned for a later phase.

## Stack

- React 19 + TypeScript + Vite
- React Router (client-side routing, one URL per tool)
- Tailwind CSS v4 (Apple-inspired light/dark theme, tokens in `src/index.css`)
- `jose` for JWT signing/verification (Web Crypto, browser-safe)
- `js-yaml`, `fast-xml-parser`, `papaparse` for JSON converters
- `ajv` for JSON Schema validation
- `jsonpath-plus` for JSONPath queries
- `jsondiffpatch` (core diff algorithm only — custom renderer in `lib/json.ts`)

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for production

```bash
npm run build       # outputs to dist/
npm run preview     # serve the production build locally
```

## Deploy for free

This is a fully static site — no backend, no environment variables, no API
keys. Any static host works:

- **Vercel:** `vercel deploy` (or connect the GitHub repo in the dashboard) —
  it auto-detects Vite.
- **Netlify:** drag-and-drop the `dist/` folder, or connect the repo with
  build command `npm run build` and publish directory `dist`.
- **GitHub Pages / Cloudflare Pages:** same build command/output directory.

## Project structure

```
src/
  components/     Layout, Sidebar, TopBar, Panel, TokenStrip, JsonTree, ...
  hooks/          useTheme (light/dark persistence)
  lib/            jwt.ts, json.ts, base64url.ts — pure logic, no UI, unit-testable
  routes/
    jwt/          validator, encode, formatter, secret-generator, fuzzer
    json/         formatter, validator, minifier, converter, schema, path,
                   diff, generator, sort, escape, editor
  App.tsx         Router config with route-level code splitting
```

Every tool is one route + one pure logic module in `lib/`. Adding a phase-2
tool (crypto key generators, hashing, password generator, etc.) means adding
a function to `lib/`, a route component, and one line in `lib/tools.ts` +
`App.tsx` — the pattern is already established.

## Adding the next phase of tools

1. Add pure logic to a new or existing file in `src/lib/`.
2. Add a route component in `src/routes/<category>/`.
3. Register it in `src/lib/tools.ts` (powers the sidebar, home page, and
   search) and add the route in `src/App.tsx` (lazy-loaded, matching the
   existing pattern).

## Notes on correctness

Every JWT/JSON transformation in `lib/` was exercised against real
inputs (round-trip tests: encode -> verify, format -> reparse, convert -> convert
back, schema pass/fail, diff -> flatten) before shipping. Worth doing again
after any change to `lib/jwt.ts` or `lib/json.ts`, since a broken sample
token or silent conversion bug is easy to miss visually.
