import { useMemo, useState } from "react";
import { ToolHeader } from "../../components/ToolHeader";
import { TokenStrip } from "../../components/TokenStrip";
import { Panel } from "../../components/Panel";
import { Callout } from "../../components/Callout";
import { parseJwt } from "../../lib/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.nmm0qepYRjhNji3O-jq8Pvcr7l_me1_bomw4EJucQCU";

function claimHints(payload: Record<string, unknown>): string[] {
  const hints: string[] = [];
  if (typeof payload.exp === "number") {
    const expired = payload.exp * 1000 < Date.now();
    hints.push(expired ? `Expired ${new Date(payload.exp * 1000).toLocaleString()}` : `Expires ${new Date(payload.exp * 1000).toLocaleString()}`);
  }
  if (typeof payload.iat === "number") hints.push(`Issued ${new Date(payload.iat * 1000).toLocaleString()}`);
  if (typeof payload.nbf === "number") hints.push(`Not valid before ${new Date(payload.nbf * 1000).toLocaleString()}`);
  return hints;
}

export default function Formatter() {
  const [token, setToken] = useState(SAMPLE);
  const parsed = useMemo(() => parseJwt(token), [token]);
  const hints = useMemo(() => claimHints(parsed.payload), [parsed.payload]);
  const expired = typeof parsed.payload.exp === "number" && (parsed.payload.exp as number) * 1000 < Date.now();

  return (
    <div>
      <ToolHeader name="Header & Payload Formatter" description="Beautify and inspect a token's decoded JSON." />

      <div className="flex flex-col gap-4">
        <Panel
          label="Token"
          value={token}
          onChange={setToken}
          minHeight="min-h-[110px]"
          placeholder="Paste a JWT here…"
        />

        <TokenStrip
          headerRaw={parsed.headerRaw}
          payloadRaw={parsed.payloadRaw}
          signatureRaw={parsed.signatureRaw}
        />

        {hints.length > 0 && (
          <Callout tone={expired ? "warn" : "info"}>{hints.join(" · ")}</Callout>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Panel
            label="Header (decoded)"
            value={parsed.headerError ?? JSON.stringify(parsed.header, null, 2)}
            readOnly
            minHeight="min-h-[220px]"
            error={parsed.headerError}
            language="json"
          />
          <Panel
            label="Payload (decoded)"
            value={parsed.payloadError ?? JSON.stringify(parsed.payload, null, 2)}
            readOnly
            minHeight="min-h-[220px]"
            error={parsed.payloadError}
            language="json"
            downloadFilename="payload.json"
          />
        </div>
      </div>
    </div>
  );
}
