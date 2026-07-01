<div align="center">

# DevKit

A modern browser-based developer toolkit for working with JWT, JSON, and data transformation utilities.

Fast. Private. Client-side. Built for developers.

</div>

---

<p align="center">
  <img src="./docs/screenshots/Homepage.png" width="900">
</p>

## Overview

DevKit is an all-in-one developer utility suite designed to simplify common development tasks directly from your browser.

It provides tools for encoding, decoding, validating, formatting, comparing, and transforming data without requiring external services or backend infrastructure.

All processing happens locally in your browser, keeping your data private and secure.

---

## Features

### JWT Tools

- Encode JWT tokens
- Decode JWT payloads
- Validate JWT structure
- Inspect token information

### JSON Tools

- JSON formatter and beautifier
- JSON validator
- JSON comparison
- JSONPath query support
- JSON schema validation

### Data Utilities

- JSON ↔ YAML conversion
- JSON ↔ XML conversion
- JSON ↔ CSV conversion

### Developer Experience

- Modern responsive interface
- Dark and light themes
- Fast client-side processing
- No account required
- No data uploaded to servers

---

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- Tailwind CSS

**Libraries**

- jose
- AJV
- JSONPath Plus
- jsondiffpatch
- js-yaml
- fast-xml-parser
- PapaParse

---

## Project Structure

```
src/
│
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Core utilities and logic
├── routes/         # Application routes
│
└── main.tsx
```

---

## Getting Started

### Prerequisites

Make sure you have:

- Node.js installed
- npm or yarn installed

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/devkit.git
```

Navigate into the project:

```bash
cd devkit
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Build for Production

Create an optimized production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Privacy

DevKit is designed with a privacy-first approach.

Your data stays inside your browser.

No files, tokens, or JSON data are sent to external servers.

---

## Roadmap

Future improvements:

- More developer utilities
- Improved tool organization
- Keyboard shortcuts
- Advanced JSON utilities
- Progressive Web App support

---

## Contributing

Contributions, suggestions, and improvements are welcome.

Feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License.