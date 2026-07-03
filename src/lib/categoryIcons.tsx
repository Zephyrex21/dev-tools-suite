import { Fingerprint, Braces, KeyRound, Lock, UserRound, Binary, Globe, type LucideIcon } from "lucide-react";
import type { ToolMeta } from "./tools";

export const categoryIcons: Record<ToolMeta["category"], LucideIcon> = {
  jwt: Fingerprint,
  json: Braces,
  crypto: KeyRound,
  security: Lock,
  identity: UserRound,
  encoding: Binary,
  resources: Globe,
};
