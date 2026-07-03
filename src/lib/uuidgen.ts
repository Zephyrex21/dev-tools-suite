import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5 } from "uuid";

export type UuidVersion = "v1" | "v4" | "v5";

export const NAMESPACES = {
  DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
} as const;

export function generateUuid(version: UuidVersion, opts?: { name?: string; namespace?: string }): string {
  if (version === "v1") return uuidv1();
  if (version === "v4") return uuidv4();
  const name = opts?.name?.trim() || "example";
  const namespace = opts?.namespace?.trim() || NAMESPACES.DNS;
  return uuidv5(name, namespace);
}

export function isValidNamespace(namespace: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(namespace.trim());
}
