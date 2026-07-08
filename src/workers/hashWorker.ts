import { hashBytes, type HashAlgo } from "../lib/crypto";

export interface HashWorkerRequest {
  id: number;
  buffer: ArrayBuffer;
  algos: HashAlgo[];
}

export interface HashWorkerResponse {
  id: number;
  results: Partial<Record<HashAlgo, string>>;
}

self.onmessage = async (e: MessageEvent<HashWorkerRequest>) => {
  const { id, buffer, algos } = e.data;
  const results: Partial<Record<HashAlgo, string>> = {};
  for (const algo of algos) {
    results[algo] = await hashBytes(buffer, algo);
  }
  const response: HashWorkerResponse = { id, results };
  self.postMessage(response);
};
