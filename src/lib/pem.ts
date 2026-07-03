function bytesToStdBase64(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
  return btoa(binary);
}

function stdBase64ToBytes(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function wrapLines(str: string, width = 64): string {
  const lines: string[] = [];
  for (let i = 0; i < str.length; i += width) lines.push(str.slice(i, i + width));
  return lines.join("\n");
}

export function toPem(bytes: ArrayBuffer, label: "PUBLIC KEY" | "PRIVATE KEY"): string {
  const b64 = wrapLines(bytesToStdBase64(bytes));
  return `-----BEGIN ${label}-----\n${b64}\n-----END ${label}-----`;
}

export function fromPem(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s+/g, "");
  return stdBase64ToBytes(b64);
}
