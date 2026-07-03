import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./routes/Landing";
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

const CryptoRsaEcKeyGen = lazy(() => import("./routes/crypto/RsaEcKeyGen"));
const CryptoEncryptionKeyGen = lazy(() => import("./routes/crypto/EncryptionKeyGen"));
const CryptoApiKeyGen = lazy(() => import("./routes/crypto/ApiKeyGen"));

const SecuritySymmetric = lazy(() => import("./routes/security/SymmetricEncryption"));
const SecurityAsymmetric = lazy(() => import("./routes/security/AsymmetricEncryption"));
const SecurityHash = lazy(() => import("./routes/security/HashGenerator"));

const IdentityPassword = lazy(() => import("./routes/identity/PasswordGenerator"));
const IdentityUuid = lazy(() => import("./routes/identity/UuidGenerator"));

const EncodingBase64 = lazy(() => import("./routes/encoding/Base64"));
const EncodingUrl = lazy(() => import("./routes/encoding/UrlEncode"));
const EncodingRegex = lazy(() => import("./routes/encoding/Regex"));

const ResourcesLorem = lazy(() => import("./routes/resources/LoremIpsum"));
const ResourcesUrlParser = lazy(() => import("./routes/resources/UrlParser"));
const ResourcesHtmlEntities = lazy(() => import("./routes/resources/HtmlEntities"));

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
          <Route path="/" element={<Landing />} />

          <Route element={<Layout />}>
            <Route path="/app" element={<Home />} />

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

            <Route path="/crypto/rsa-ec-keygen" element={<CryptoRsaEcKeyGen />} />
            <Route path="/crypto/encryption-key" element={<CryptoEncryptionKeyGen />} />
            <Route path="/crypto/api-key" element={<CryptoApiKeyGen />} />

            <Route path="/security/symmetric" element={<SecuritySymmetric />} />
            <Route path="/security/asymmetric" element={<SecurityAsymmetric />} />
            <Route path="/security/hash" element={<SecurityHash />} />

            <Route path="/identity/password" element={<IdentityPassword />} />
            <Route path="/identity/uuid" element={<IdentityUuid />} />

            <Route path="/encoding/base64" element={<EncodingBase64 />} />
            <Route path="/encoding/url" element={<EncodingUrl />} />
            <Route path="/encoding/regex" element={<EncodingRegex />} />

            <Route path="/resources/lorem-ipsum" element={<ResourcesLorem />} />
            <Route path="/resources/url-parser" element={<ResourcesUrlParser />} />
            <Route path="/resources/html-entities" element={<ResourcesHtmlEntities />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
