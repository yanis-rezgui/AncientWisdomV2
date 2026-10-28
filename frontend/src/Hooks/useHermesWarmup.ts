import { useEffect, useState } from "react";

export type HermesStatus = "idle" | "waking" | "ready" | "failed";

const HEALTH_URL = `${import.meta.env.VITE_API_URL}/api/v1/hermes/health`;
const MAX_MS = 150_000;
const POLL_DELAY_MS = 5_000;

export function useHermesWarmup(token: string | null | undefined): HermesStatus {
    const [status, setStatus] = useState<HermesStatus>("idle");

useEffect(() => {
    if (!token) {
        setStatus("idle");
        return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const start = Date.now();

    setStatus("waking");

    const poll = async () => {
        while (!cancelled && Date.now() - start < MAX_MS) {
            try {
                const res = await fetch(HEALTH_URL, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: AbortSignal.any([
                        controller.signal,
                        AbortSignal.timeout(30_000),
                    ]),
                });

                if (res.ok) {
                    const json = await res.json();

                    if (json.status === "ok") {
                        if (!cancelled) setStatus("ready");
                        return;
                    }
                }
            } catch {
                // endormi, timeout ou requête annulée : on réessaie (sauf si cancelled)
            }

            if (cancelled) return;
            await new Promise((r) => setTimeout(r, POLL_DELAY_MS));
        }

        if (!cancelled) setStatus("failed");
    };

    void poll();

    return () => {
        cancelled = true;
        controller.abort();
    };
}, [token]);

    return status;
}