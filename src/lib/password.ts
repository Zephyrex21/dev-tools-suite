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

export function generatePasswords(opts: PasswordOptions, count: number): string[] {
  return Array.from({ length: count }, () => generatePassword(opts));
}

// A plain, unambiguous word list for memorable/Diceware-style passwords — short,
// common, easy-to-type words, deliberately excluding anything easily confused
// when spoken or typed (no near-homophones, no words under 3 letters).
const WORD_LIST = [
  "anchor", "apple", "arrow", "autumn", "badge", "banjo", "basket", "beacon", "bicycle", "birch",
  "blanket", "bloom", "border", "bottle", "branch", "brave", "breeze", "bridge", "bronze", "candle",
  "canyon", "cargo", "cedar", "century", "chalk", "charm", "cherry", "circuit", "cliff", "cloud",
  "clover", "coast", "comet", "compass", "coral", "cotton", "crater", "crown", "crystal", "dawn",
  "delta", "desert", "diamond", "dolphin", "dragon", "drift", "eagle", "echo", "ember", "emerald",
  "engine", "fable", "falcon", "feather", "fern", "flame", "forest", "fossil", "fountain", "garden",
  "garnet", "glacier", "glider", "granite", "gravel", "harbor", "harvest", "hazel", "hollow", "honey",
  "horizon", "hunter", "island", "ivory", "jacket", "jasper", "jungle", "kernel", "kettle", "ladder",
  "lagoon", "lantern", "laurel", "lemon", "linen", "lotus", "lumber", "magnet", "mantle", "maple",
  "marble", "meadow", "melody", "mirror", "mist", "monarch", "moss", "mountain", "myrtle", "nectar",
  "nomad", "oak", "oasis", "onyx", "opal", "orbit", "orchid", "otter", "outpost", "oxygen",
  "paddle", "panther", "parcel", "pebble", "petal", "phoenix", "pillar", "pine", "planet", "plaza",
  "pocket", "prairie", "prism", "quarry", "quartz", "quilt", "rabbit", "raven", "reef", "ridge",
  "river", "rocket", "sable", "saffron", "sail", "sapphire", "scout", "shadow", "shore", "silver",
  "sonic", "spark", "sparrow", "sphere", "spiral", "spruce", "stable", "starling", "storm", "summit",
  "sunrise", "swan", "tavern", "temple", "thicket", "thistle", "thunder", "timber", "torch", "trail",
  "trellis", "tulip", "tundra", "turtle", "valley", "velvet", "violet", "voyage", "walnut", "willow",
  "winter", "wisdom", "zephyr",
];

export interface MemorableOptions {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  includeNumber: boolean;
}

export function generateMemorablePassword(opts: MemorableOptions): string {
  const indices = crypto.getRandomValues(new Uint32Array(opts.wordCount));
  const words = Array.from(indices, (i) => WORD_LIST[i % WORD_LIST.length]).map((w) =>
    opts.capitalize ? w.charAt(0).toUpperCase() + w.slice(1) : w,
  );
  let result = words.join(opts.separator);
  if (opts.includeNumber) {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 100;
    result += opts.separator + n;
  }
  return result;
}

/** Correct entropy for the word-based scheme: log2(dictionary size) per word, not per character. */
export function estimateMemorableStrength(opts: MemorableOptions): { bitsOfEntropy: number; label: Strength } {
  const bitsPerWord = Math.log2(WORD_LIST.length);
  const bits = bitsPerWord * opts.wordCount + (opts.includeNumber ? Math.log2(100) : 0);
  return { bitsOfEntropy: Math.round(bits), label: strengthLabel(bits) };
}

export type Strength = "very weak" | "weak" | "fair" | "strong" | "very strong";

export function strengthLabel(bits: number): Strength {
  if (bits >= 100) return "very strong";
  if (bits >= 70) return "strong";
  if (bits >= 45) return "fair";
  if (bits >= 25) return "weak";
  return "very weak";
}

export function estimateStrength(password: string): { bitsOfEntropy: number; label: Strength } {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

  const bits = password.length > 0 && poolSize > 0 ? Math.log2(poolSize) * password.length : 0;
  return { bitsOfEntropy: Math.round(bits), label: strengthLabel(bits) };
}
