import { useEffect, useRef } from "react";
import type { RegexMatch, Result } from "../lib/encoding";

type RegexResult = Result<{ matches: RegexMatch[]; isMatch: boolean }>;

const TIMEOUT_MS = 2000;

export function useRegexWorker() {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  const pendingRef = useRef<Map<number, (result: RegexResult) => void>>(new Map());

  function getWorker(): Worker {
    if (!workerRef.current) {
      const worker = new Worker(new URL("../workers/regexWorker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (e: MessageEvent<{ id: number; result: RegexResult }>) => {
        const resolve = pendingRef.current.get(e.data.id);
        resolve?.(e.data.result);
        pendingRef.current.delete(e.data.id);
      };
      workerRef.current = worker;
    }
    return workerRef.current;
  }

  function terminateAndRespawn() {
    workerRef.current?.terminate();
    workerRef.current = null;
    pendingRef.current.clear();
  }

  useEffect(() => {
    return () => workerRef.current?.terminate();
  }, []);

  function run(pattern: string, flags: string, text: string): Promise<RegexResult> {
    const worker = getWorker();
    const id = ++requestIdRef.current;

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        pendingRef.current.delete(id);
        terminateAndRespawn();
        resolve({
          ok: false,
          error:
            "This pattern took too long to evaluate and was stopped — it likely has catastrophic backtracking. Try simplifying it (common cause: nested quantifiers like (a+)+).",
        });
      }, TIMEOUT_MS);

      pendingRef.current.set(id, (result) => {
        clearTimeout(timer);
        resolve(result);
      });

      worker.postMessage({ id, pattern, flags, text });
    });
  }

  return run;
}
