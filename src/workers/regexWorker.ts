import { testRegex } from "../lib/encoding";

export interface RegexWorkerRequest {
  id: number;
  pattern: string;
  flags: string;
  text: string;
}

self.onmessage = (e: MessageEvent<RegexWorkerRequest>) => {
  const { id, pattern, flags, text } = e.data;
  const result = testRegex(pattern, flags, text);
  self.postMessage({ id, result });
};
