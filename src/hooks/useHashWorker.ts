import { useEffect, useRef } from "react";
import type { HashAlgo } from "../lib/crypto";

export function useHashWorker() {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingRef = useRef<Map<number, (results: Partial<Record<HashAlgo, string>>) => void>>(new Map());

  function getWorker(): Worker {
    if (!workerRef.current) {
      const worker = new Worker(new URL("../workers/hashWorker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (e: MessageEvent<{ id: number; results: Partial<Record<HashAlgo, string>> }>) => {
        const resolve = pendingRef.current.get(e.data.id);
        resolve?.(e.data.results);
        pendingRef.current.delete(e.data.id);
      };
      workerRef.current = worker;
    }
    return workerRef.current;
  }

  useEffect(() => {
    return () => workerRef.current?.terminate();
  }, []);

  function run(buffer: ArrayBuffer, algos: HashAlgo[]): Promise<Partial<Record<HashAlgo, string>>> {
    const worker = getWorker();
    const id = ++requestIdRef.current;
    return new Promise((resolve) => {
      pendingRef.current.set(id, resolve);
      // Transfer ownership of the buffer to the worker instead of copying it —
      // meaningfully faster for large files since it avoids a full memory copy.
      worker.postMessage({ id, buffer, algos }, [buffer]);
    });
  }

  return run;
}
