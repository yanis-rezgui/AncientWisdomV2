
// AdminContexts/QuizAdminContext.tsx

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import type {
    Pagination,
    Quiz,
    QuizDifficulty,
    QuizStatus,
} from "../Types/Types";
import { useAuthContext } from "../Contexts/AuthContext";


const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/admin/quizzes`;

const NETWORK_MESSAGE = "Network error. Check your connection and try again.";

/* =========================
   TYPES
========================= */

export interface QuizAdminFilters {
    search: string;
    status: QuizStatus | "";
    difficulty: QuizDifficulty | "";
}

export interface QuizPayload {
    title?: string;
    description?: string;
    slug?: string;
    eras?: string[];
    questions?: { question: string; order: number; points: number }[];
    difficulty?: QuizDifficulty;
    timeLimit?: number | null;
    status?: QuizStatus;
}

interface QuizAdminContextType {
    // Liste
    adminQuizzes: Quiz[];
    totalQuizzes: number;
    page: number;
    limit: number;
    totalPages: number;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    filters: QuizAdminFilters;
    setFilters: (filters: QuizAdminFilters) => void;
    loadingQuizzes: boolean;
    refreshQuizzes: () => Promise<void>;

    // Un quiz
    currentQuiz: Quiz | null;
    loadingQuiz: boolean;
    getAdminQuiz: (id: string) => Promise<void>;

    // Actions
    addQuiz: (payload: QuizPayload) => Promise<boolean>;
    updateQuiz: (id: string, payload: QuizPayload) => Promise<boolean>;
    deleteQuiz: (id: string) => Promise<boolean>;
    loadingAddQuiz: boolean;
    loadingUpdateQuiz: boolean;
    loadingDeleteQuiz: boolean;

    // Popup de suppression
    showDeletePop: boolean;
    setShowDeletePop: (value: boolean) => void;
    quizDelete: Quiz | null;
    setQuizDelete: (quiz: Quiz | null) => void;

    // Erreurs
    errorMsg: string;
    setErrorMsg: (msg: string) => void;
}

const QuizAdminContext = createContext<QuizAdminContextType | null>(null);

const defaultFilters: QuizAdminFilters = {
    search: "",
    status: "",
    difficulty: "",
};

/* =========================
   API HELPERS
========================= */

type ApiBody<T> = {
    success?: boolean;
    message?: string;
    error?: string;
    data?: T;
    pagination?: Pagination;
};

const request = async <T = unknown,>(
    url: string,
    options: RequestInit = {},
    token?: string | null
) => {
    const headers = new Headers(options.headers);

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    const body: ApiBody<T> = await res.json().catch(() => ({}));

    return {
        ok: res.ok,
        status: res.status,
        body,
    };
};

const getMessage = (body: ApiBody<unknown>, fallback: string) =>
    body.message || body.error || fallback;

/* =========================
   PROVIDER
========================= */

export const QuizAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    // Auth
    const { token } = useAuthContext();

    // Liste
    const [adminQuizzes, setAdminQuizzes] = useState<Quiz[]>([]);
    const [totalQuizzes, setTotalQuizzes] = useState<number>(0);
    const [page, setPageState] = useState<number>(1);
    const [limit, setLimitState] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filters, setFiltersState] =
        useState<QuizAdminFilters>(defaultFilters);
    const [loadingQuizzes, setLoadingQuizzes] = useState<boolean>(false);

    // Un quiz
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);

    // Actions
    const [loadingAddQuiz, setLoadingAddQuiz] = useState<boolean>(false);
    const [loadingUpdateQuiz, setLoadingUpdateQuiz] = useState<boolean>(false);
    const [loadingDeleteQuiz, setLoadingDeleteQuiz] = useState<boolean>(false);

    // Popup suppression
    const [showDeletePop, setShowDeletePop] = useState<boolean>(false);
    const [quizDelete, setQuizDelete] = useState<Quiz | null>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");

    /* ---------- Liste ---------- */

    const fetchQuizzes = useCallback(async () => {
        setLoadingQuizzes(true);

        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });

            if (filters.search.trim()) {
                params.set("search", filters.search.trim());
            }

            if (filters.status) {
                params.set("status", filters.status);
            }

            if (filters.difficulty) {
                params.set("difficulty", filters.difficulty);
            }

            const { ok, body } = await request<Quiz[]>(
                `${API_URL}?${params.toString()}`,
                {},
                token
            );

            if (!ok || body.success === false) {
                throw new Error(
                    getMessage(body, "Something went wrong.")
                );
            }

            setAdminQuizzes(body.data ?? []);
            setTotalQuizzes(body.pagination?.total ?? 0);
            setTotalPages(body.pagination?.totalPages ?? 1);
            setErrorMsg("");
        } catch (error) {
            setAdminQuizzes([]);
            setTotalQuizzes(0);
            setTotalPages(1);

            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : NETWORK_MESSAGE
            );
        } finally {
            setLoadingQuizzes(false);
        }
    }, [page, limit, filters, token]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    // Tout changement de filtre ramène à la page 1
    const setFilters = useCallback((newFilters: QuizAdminFilters) => {
        setFiltersState(newFilters);
        setPageState(1);
    }, []);

    const setPage = useCallback((value: number) => {
        setPageState(value);
    }, []);

    const setLimit = useCallback((value: number) => {
        setLimitState(value);
        setPageState(1);
    }, []);

    /* ---------- Un quiz ----------
       Le backend n'a pas de GET /admin/quizzes/:id.
       On cherche d'abord dans la liste déjà chargée, sinon on parcourt
       les pages (100 par page) jusqu'à le trouver. */

    const getAdminQuiz = useCallback(
        async (id: string) => {
            setLoadingQuiz(true);
            setCurrentQuiz(null);
            setErrorMsg("");

            try {
                const inState = adminQuizzes.find((q) => q._id === id);

                if (inState) {
                    setCurrentQuiz(inState);
                    return;
                }

                let p = 1;
                let totalP = 1;

                do {
                    const { ok, body } = await request<Quiz[]>(
                        `${API_URL}?page=${p}&limit=100`,
                        {},
                        token
                    );

                    if (!ok || body.success === false) {
                        throw new Error(
                            getMessage(body, "Unable to load quizzes.")
                        );
                    }

                    const found = (body.data ?? []).find(
                        (q) => q._id === id
                    );

                    if (found) {
                        setCurrentQuiz(found);
                        return;
                    }

                    totalP = body.pagination?.totalPages ?? 0;
                    p++;
                } while (p <= totalP);

                setErrorMsg("Quiz not found.");
            } catch (error) {
                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : NETWORK_MESSAGE
                );
            } finally {
                setLoadingQuiz(false);
            }
        },
        [adminQuizzes, token]
    );

    /* ---------- Add ---------- */

    const addQuiz = useCallback(
        async (payload: QuizPayload): Promise<boolean> => {
            setLoadingAddQuiz(true);
            setErrorMsg("");

            try {
                const { ok, body } = await request<Quiz>(
                    API_URL,
                    {
                        method: "POST",
                        body: JSON.stringify(payload),
                    },
                    token
                );

                if (!ok || body.success === false) {
                    throw new Error(
                        getMessage(body, "Unable to create quiz.")
                    );
                }

                await fetchQuizzes();
                return true;
            } catch (error) {
                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : NETWORK_MESSAGE
                );
                return false;
            } finally {
                setLoadingAddQuiz(false);
            }
        },
        [fetchQuizzes, token]
    );

    /* ---------- Update ---------- */

    const updateQuiz = useCallback(
        async (
            id: string,
            payload: QuizPayload
        ): Promise<boolean> => {
            setLoadingUpdateQuiz(true);
            setErrorMsg("");

            try {
                const { ok, body } = await request<Quiz>(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload),
                    },
                    token
                );

                if (!ok || body.success === false || !body.data) {
                    throw new Error(
                        getMessage(body, "Unable to update quiz.")
                    );
                }

                setCurrentQuiz(body.data);

                setAdminQuizzes((prev) =>
                    prev.map((q) =>
                        q._id === id ? body.data! : q
                    )
                );

                return true;
            } catch (error) {
                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : NETWORK_MESSAGE
                );
                return false;
            } finally {
                setLoadingUpdateQuiz(false);
            }
        },
        [token]
    );

    /* ---------- Delete ----------
       Le backend renvoie 409 si le quiz a des tentatives :
       le message ("Archive it instead.") est affiché dans la popup. */

    const deleteQuiz = useCallback(
        async (id: string): Promise<boolean> => {
            setLoadingDeleteQuiz(true);
            setErrorMsg("");

            try {
                const { ok, body } = await request(
                    `${API_URL}/${id}`,
                    { method: "DELETE" },
                    token
                );

                if (!ok || body.success === false) {
                    throw new Error(
                        getMessage(body, "Unable to delete quiz.")
                    );
                }

                setAdminQuizzes((prev) =>
                    prev.filter((q) => q._id !== id)
                );

                setTotalQuizzes((prev) => Math.max(0, prev - 1));
                setCurrentQuiz(null);

                // Recharge la liste pour recaler la pagination.
                await fetchQuizzes();

                return true;
            } catch (error) {
                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : NETWORK_MESSAGE
                );
                return false;
            } finally {
                setLoadingDeleteQuiz(false);
            }
        },
        [fetchQuizzes, token]
    );

    /* ---------- Value ---------- */

    const value = useMemo<QuizAdminContextType>(
        () => ({
            adminQuizzes,
            totalQuizzes,
            page,
            limit,
            totalPages,
            setPage,
            setLimit,
            filters,
            setFilters,
            loadingQuizzes,
            refreshQuizzes: fetchQuizzes,

            currentQuiz,
            loadingQuiz,
            getAdminQuiz,

            addQuiz,
            updateQuiz,
            deleteQuiz,
            loadingAddQuiz,
            loadingUpdateQuiz,
            loadingDeleteQuiz,

            showDeletePop,
            setShowDeletePop,
            quizDelete,
            setQuizDelete,

            errorMsg,
            setErrorMsg,
        }),
        [
            adminQuizzes,
            totalQuizzes,
            page,
            limit,
            totalPages,
            setPage,
            setLimit,
            filters,
            setFilters,
            loadingQuizzes,
            fetchQuizzes,
            currentQuiz,
            loadingQuiz,
            getAdminQuiz,
            addQuiz,
            updateQuiz,
            deleteQuiz,
            loadingAddQuiz,
            loadingUpdateQuiz,
            loadingDeleteQuiz,
            showDeletePop,
            quizDelete,
            errorMsg,
        ]
    );

    return (
        <QuizAdminContext.Provider value={value}>
            {children}
        </QuizAdminContext.Provider>
    );
};

export const useQuizAdminContext = () => {
    const ctx = useContext(QuizAdminContext);

    if (!ctx) {
        throw new Error(
            "useQuizAdminContext must be used inside QuizAdminProvider"
        );
    }

    return ctx;
};

