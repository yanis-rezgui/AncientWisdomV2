import { useCallback, useState } from "react";


import type { AdminActionResult } from "../../Types/GamesAdmin";
import { useAuthContext } from "../../Contexts/AuthContext";

/* =========================
   REQUEST HELPERS
========================= */

const ADMIN_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/admin`;

type AdminBody = FormData | Record<string, unknown>;

interface ApiPayload<T> {
    success?: boolean;
    message?: string;
    data?: T;
}

const adminRequest = async <T>(
    url: string,
    method: "POST" | "PUT" | "DELETE",
    token: string | null | undefined,
    body?: AdminBody
): Promise<AdminActionResult<T>> => {
    if (!token) {
        return { success: false, message: "You must be signed in." };
    }

    try {
        const headers: Record<string, string> = {
            Authorization: `Bearer ${token}`,
        };

        const isFormData = body instanceof FormData;

        // Avec FormData, le navigateur ajoute lui-même le Content-Type (avec le boundary).
        if (body && !isFormData) {
            headers["Content-Type"] = "application/json";
        }

        const res = await fetch(url, {
            method,
            headers,
            body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });

        let payload: ApiPayload<T> | null = null;

        try {
            payload = await res.json();
        } catch {
            payload = null;
        }

        if (!res.ok) {
            return {
                success: false,
                message: payload?.message ?? "An error occurred.",
            };
        }

        return {
            success: true,
            message: payload?.message ?? "Done.",
            data: payload?.data,
        };
    } catch (error) {
        console.error("Admin request failed:", error);
        return { success: false, message: "Could not reach the server." };
    }
};

// Ajoute un champ à un FormData : les tableaux / objets sont envoyés en JSON,
// les valeurs undefined / null sont ignorées (modification partielle).
export const appendField = (form: FormData, key: string, value: unknown) => {
    if (value === undefined || value === null) return;

    if (typeof value === "string") {
        form.append(key, value);
    } else if (typeof value === "number" || typeof value === "boolean") {
        form.append(key, String(value));
    } else {
        form.append(key, JSON.stringify(value));
    }
};

/* =========================
   GENERIC ADMIN HOOK
========================= */

interface Options<TInput> {
    // Segment de route sous /api/v1/admin (ex. "figure-challenges")
    path: string;
    // Transforme les données du formulaire en FormData (avec fichiers) ou en objet JSON.
    // Doit être une fonction stable (définie hors du composant).
    buildBody: (input: Partial<TInput>) => AdminBody;
}

export function useChallengeAdminActions<
    TEntity extends { _id: string },
    TInput,
>({ path, buildBody }: Options<TInput>) {
    const { token } = useAuthContext();

    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [challengeToDelete, setChallengeToDelete] =
        useState<TEntity | null>(null);

    const showDeletePop = challengeToDelete !== null;

    const addChallenge = useCallback(
        async (input: TInput): Promise<AdminActionResult<TEntity>> => {
            setLoadingAdd(true);

            try {
                return await adminRequest<TEntity>(
                    `${ADMIN_API_URL}/${path}`,
                    "POST",
                    token,
                    buildBody(input)
                );
            } finally {
                setLoadingAdd(false);
            }
        },
        [token, path, buildBody]
    );

    const updateChallenge = useCallback(
        async (
            id: string,
            input: Partial<TInput>
        ): Promise<AdminActionResult<TEntity>> => {
            setLoadingUpdate(true);

            try {
                return await adminRequest<TEntity>(
                    `${ADMIN_API_URL}/${path}/${id}`,
                    "PUT",
                    token,
                    buildBody(input)
                );
            } finally {
                setLoadingUpdate(false);
            }
        },
        [token, path, buildBody]
    );

    const deleteChallenge = useCallback(
        async (id: string): Promise<AdminActionResult> => {
            setLoadingDelete(true);

            try {
                const result = await adminRequest<undefined>(
                    `${ADMIN_API_URL}/${path}/${id}`,
                    "DELETE",
                    token
                );

                // La popup se ferme seulement si la suppression a réussi
                if (result.success) setChallengeToDelete(null);

                return result;
            } finally {
                setLoadingDelete(false);
            }
        },
        [token, path]
    );

    const openDeletePop = useCallback((challenge: TEntity) => {
        setChallengeToDelete(challenge);
    }, []);

    const closeDeletePop = useCallback(() => {
        setChallengeToDelete(null);
    }, []);

    return {
        loadingAdd,
        loadingUpdate,
        loadingDelete,
        showDeletePop,
        challengeToDelete,
        addChallenge,
        updateChallenge,
        deleteChallenge,
        openDeletePop,
        closeDeletePop,
    };
}
