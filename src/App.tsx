import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./routes/Home";

const JwtValidator = lazy(() => import("./routes/jwt/Validator"));
const JwtEncode = lazy(() => import("./routes/jwt/Encode"));
const JwtFormatter = lazy(() => import("./routes/jwt/Formatter"));
const JwtSecretGenerator = lazy(() => import("./routes/jwt/SecretGenerator"));
const JwtFuzzer = lazy(() => import("./routes/jwt/Fuzzer"));

const JsonFormatter = lazy(() => import("./routes/json/Formatter"));
const JsonValidator = lazy(() => import("./routes/json/Validator"));
const JsonMinifier = lazy(() => import("./routes/json/Minifier"));
const JsonConverter = lazy(() => import("./routes/json/Converter"));
const JsonSchema = lazy(() => import("./routes/json/Schema"));
const JsonPath = lazy(() => import("./routes/json/Path"));
const JsonDiff = lazy(() => import("./routes/json/Diff"));
const JsonGenerator = lazy(() => import("./routes/json/Generator"));
const JsonSort = lazy(() => import("./routes/json/Sort"));
const JsonEscape = lazy(() => import("./routes/json/Escape"));
const JsonEditor = lazy(() => import("./routes/json/Editor"));

function RouteFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />

            <Route path="/jwt/validator" element={<JwtValidator />} />
            <Route path="/jwt/encode" element={<JwtEncode />} />
            <Route path="/jwt/formatter" element={<JwtFormatter />} />
            <Route path="/jwt/secret-generator" element={<JwtSecretGenerator />} />
            <Route path="/jwt/fuzzer" element={<JwtFuzzer />} />

            <Route path="/json/formatter" element={<JsonFormatter />} />
            <Route path="/json/validator" element={<JsonValidator />} />
            <Route path="/json/minifier" element={<JsonMinifier />} />
            <Route path="/json/converter" element={<JsonConverter />} />
            <Route path="/json/schema" element={<JsonSchema />} />
            <Route path="/json/path" element={<JsonPath />} />
            <Route path="/json/diff" element={<JsonDiff />} />
            <Route path="/json/generator" element={<JsonGenerator />} />
            <Route path="/json/sort" element={<JsonSort />} />
            <Route path="/json/escape" element={<JsonEscape />} />
            <Route path="/json/editor" element={<JsonEditor />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
