import { useCallback, useEffect, useState } from "react";

import { useAuthContext } from "../../Contexts/AuthContext";

const ADMIN_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/admin`;

interface ListPayload<T> {
    message?: string;
    data?: T[];
    pagination?: { total: number; totalPages: number };
}

/* =========================
   LIST (paginated + search)
========================= */

export function useAdminChallenges<T extends { _id: string }>(
    path: string,
    limit = 10
) {
    const { token } = useAuthContext();

    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const [page, setPage] = useState(1);
    const [search, setSearchValue] = useState("");
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!token) return;

        const controller = new AbortController();

        const load = async () => {
            setLoading(true);
            setErrorMsg("");

            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (search.trim()) params.set("search", search.trim());

                const res = await fetch(
                    `${ADMIN_API_URL}/${path}?${params.toString()}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        signal: controller.signal,
                    }
                );

                const payload: ListPayload<T> = await res.json();

                if (!res.ok) {
                    throw new Error(
                        payload.message ?? "Could not load the challenges."
                    );
                }

                setItems(payload.data ?? []);
                setTotal(payload.pagination?.total ?? 0);
                setTotalPages(Math.max(1, payload.pagination?.totalPages ?? 1));
            } catch (error) {
                if ((error as Error).name === "AbortError") return;

                setItems([]);
                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : "Could not load the challenges."
                );
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        // Pas de debounce ici : AdminLearnList en applique déjà un sur la recherche
        void load();

        return () => controller.abort();
    }, [token, path, page, search, limit, reloadKey]);

    const setSearch = useCallback((value: string) => {
        setPage(1);
        setSearchValue(value);
    }, []);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return {
        items,
        loading,
        errorMsg,
        page,
        setPage,
        search,
        setSearch,
        total,
        totalPages,
        reload,
    };
}

/* =========================
   GET ONE (update page)
========================= */

export const fetchAdminChallenge = async <T,>(
    path: string,
    id: string,
    token: string
): Promise<{ data?: T; message?: string }> => {
    try {
        const res = await fetch(`${ADMIN_API_URL}/${path}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const payload: { data?: T; message?: string } = await res.json();

        if (!res.ok) {
            return { message: payload.message ?? "Challenge not found." };
        }

        return { data: payload.data };
    } catch (error) {
        console.error("Error fetching admin challenge:", error);
        return { message: "Could not reach the server." };
    }
};