# DevKit — Engineering Details

The root README is intentionally concise. This document keeps the deeper implementation notes that are useful for contributors and reviewers.

## Testing

The project uses Vitest for the pure logic layer and React Testing Library for behavior that requires rendering. The current README documents 92 tests covering JWT operations, JSON transformations, encryption, hashing, password calculations, UUID generation, syntax tokenization, and selected component behavior.

## Hardening

- Regex matching runs in a Web Worker with a timeout to prevent catastrophic backtracking from freezing the main UI.
- File hashing runs in a Web Worker so large inputs do not block the interface.
- The JSON Tree Editor limits recursive rendering depth to avoid pathological component trees.
- Route-level error boundaries isolate failures to individual tools.
- Uncaught asynchronous errors are surfaced through a lightweight global reporting path.

## Design principles

### Client-side first

There is no backend, database, account system, or required API key. Sensitive operations are performed locally in the browser where possible.

### Pure logic separated from UI

Utility implementations live in `src/lib/` while route components handle presentation and interaction. This keeps the core operations independently testable.

### One route per tool

Tools are lazy-loaded through React Router. Shared metadata powers the sidebar, dashboard, command palette, and search.

### Standards-based cryptography

Web Crypto API is used for browser-native cryptographic operations, with `jose` handling JWT signing and verification. Hashing and selected utilities have dedicated implementations where appropriate.

## CI

GitHub Actions runs linting, type checking/build verification, and the test suite on pushes and pull requests.
