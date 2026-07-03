export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

const SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};
const AMBIGUOUS = "Il1O0";

export function buildAlphabet(opts: PasswordOptions): string {
  let alphabet = "";
  if (opts.uppercase) alphabet += SETS.uppercase;
  if (opts.lowercase) alphabet += SETS.lowercase;
  if (opts.numbers) alphabet += SETS.numbers;
  if (opts.symbols) alphabet += SETS.symbols;
  if (opts.excludeAmbiguous) {
    alphabet = alphabet
      .split("")
      .filter((c) => !AMBIGUOUS.includes(c))
      .join("");
  }
  return alphabet;
}

export function generatePassword(opts: PasswordOptions): string {
  const alphabet = buildAlphabet(opts);
  if (!alphabet) return "";
  const bytes = crypto.getRandomValues(new Uint32Array(opts.length));
  let result = "";
  for (let i = 0; i < opts.length; i++) {
    result += alphabet[bytes[i] % alphabet.length];
  }
  return result;
}

export type Strength = "very weak" | "weak" | "fair" | "strong" | "very strong";

export function estimateStrength(password: string): { bitsOfEntropy: number; label: Strength } {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

  const bits = password.length > 0 && poolSize > 0 ? Math.log2(poolSize) * password.length : 0;

  let label: Strength = "very weak";
  if (bits >= 100) label = "very strong";
  else if (bits >= 70) label = "strong";
  else if (bits >= 45) label = "fair";
  else if (bits >= 25) label = "weak";

  return { bitsOfEntropy: Math.round(bits), label };
}
