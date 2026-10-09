// AdminContexts/QuizQuestionsAdminContext.tsx

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
    IQuizQuestion,
    QuizQuestionDifficulty,
    QuizQuestionStatus,
} from "../Types/Types";
import { useAuthContext } from "../Contexts/AuthContext";



const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/admin/quiz-questions`;

const NETWORK_MESSAGE = "Network error. Check your connection and try again.";

/* =========================
   TYPES
========================= */

export interface QuestionAdminFilters {
    search: string;
    era: string;
    difficulty: QuizQuestionDifficulty | "";
    status: QuizQuestionStatus | "";
}

export interface QuestionPayload {
    questionText?: string;
    options?: string[];
    correctAnswerIndex?: number;
    explanation?: string;
    era?: string;
    difficulty?: QuizQuestionDifficulty;
    source?: string;
    tags?: string[];
    status?: QuizQuestionStatus;
}

interface QuestionsAdminContextType {
    questions: IQuizQuestion[];
    totalQuestions: number;
    page: number;
    limit: number;
    totalPages: number;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    filters: QuestionAdminFilters;
    setFilters: (filters: QuestionAdminFilters) => void;
    loadingQuestions: boolean;
    refreshQuestions: () => Promise<void>;

    addQuestion: (payload: QuestionPayload) => Promise<IQuizQuestion | null>;
    updateQuestion: (
        id: string,
        payload: QuestionPayload
    ) => Promise<IQuizQuestion | null>;
    deleteQuestion: (id: string) => Promise<boolean>;

    loadingAddQuestion: boolean;
    loadingUpdateQuestion: boolean;
    loadingDeleteQuestion: boolean;

    showDeletePop: boolean;
    setShowDeletePop: (value: boolean) => void;
    questionDelete: IQuizQuestion | null;
    setQuestionDelete: (question: IQuizQuestion | null) => void;

    errorMsg: string;
    setErrorMsg: (msg: string) => void;
}

const QuestionsAdminContext =
    createContext<QuestionsAdminContextType | null>(null);

const defaultFilters: QuestionAdminFilters = {
    search: "",
    era: "",
    difficulty: "",
    status: "",
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

const getMessage = (
    body: ApiBody<unknown>,
    fallback: string
) => body.message || body.error || fallback;

/* =========================
   PROVIDER
========================= */

export const QuizQuestionsAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    // Auth
    const { token } = useAuthContext();

    // Liste
    const [questions, setQuestions] = useState<IQuizQuestion[]>([]);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [page, setPageState] = useState<number>(1);
    const [limit, setLimitState] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filters, setFiltersState] =
        useState<QuestionAdminFilters>(defaultFilters);
    const [loadingQuestions, setLoadingQuestions] =
        useState<boolean>(false);

    // Actions
    const [loadingAddQuestion, setLoadingAddQuestion] =
        useState<boolean>(false);
    const [loadingUpdateQuestion, setLoadingUpdateQuestion] =
        useState<boolean>(false);
    const [loadingDeleteQuestion, setLoadingDeleteQuestion] =
        useState<boolean>(false);

    // Popup suppression
    const [showDeletePop, setShowDeletePop] = useState<boolean>(false);
    const [questionDelete, setQuestionDelete] =
        useState<IQuizQuestion | null>(null);

    // Erreurs
    const [errorMsg, setErrorMsg] = useState<string>("");

    /* ---------- Liste ---------- */

    const fetchQuestions = useCallback(async () => {
        setLoadingQuestions(true);

        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });

            if (filters.search.trim()) {
                params.set("search", filters.search.trim());
            }

            if (filters.era) {
                params.set("era", filters.era);
            }

            if (filters.difficulty) {
                params.set("difficulty", filters.difficulty);
            }

            if (filters.status) {
                params.set("status", filters.status);
            }

            const { ok, body } = await request<IQuizQuestion[]>(
                `${API_URL}?${params.toString()}`,
                {},
                token
            );

            if (!ok || body.success === false) {
                throw new Error(
                    getMessage(body, "Unable to load questions.")
                );
            }

            setQuestions(body.data ?? []);
            setTotalQuestions(body.pagination?.total ?? 0);
            setTotalPages(body.pagination?.totalPages ?? 1);
            setErrorMsg("");
        } catch (error) {
            console.error(error);

            setQuestions([]);
            setTotalQuestions(0);
            setTotalPages(1);

            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : NETWORK_MESSAGE
            );
        } finally {
            setLoadingQuestions(false);
        }
    }, [page, limit, filters, token]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    /* ---------- Pagination et filtres ---------- */

    const setFilters = useCallback(
        (newFilters: QuestionAdminFilters) => {
            setFiltersState(newFilters);
            setPageState(1);
        },
        []
    );

    const setPage = useCallback((value: number) => {
        setPageState(value);
    }, []);

    const setLimit = useCallback((value: number) => {
        setLimitState(value);
        setPageState(1);
    }, []);

    /* ---------- Add ---------- */

    // Retourne la question créée, ou null en cas d'erreur.
    const addQuestion = useCallback(
        async (
            payload: QuestionPayload
        ): Promise<IQuizQuestion | null> => {
            setLoadingAddQuestion(true);
            setErrorMsg("");

            try {
                const { ok, body } = await request<IQuizQuestion>(
                    API_URL,
                    {
                        method: "POST",
                        body: JSON.stringify(payload),
                    },
                    token
                );

                if (!ok || body.success === false || !body.data) {
                    throw new Error(
                        getMessage(body, "Unable to create question.")
                    );
                }

                await fetchQuestions();

                return body.data;
            } catch (error) {
                console.error(error);

                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : NETWORK_MESSAGE
                );

                return null;
            } finally {
                setLoadingAddQuestion(false);
            }
        },
        [fetchQuestions, token]
    );

    /* ---------- Update ---------- */

    const updateQuestion = useCallback(
        async (
            id: string,
            payload: QuestionPayload
        ): Promise<IQuizQuestion | null> => {
            setLoadingUpdateQuestion(true);
            setErrorMsg("");

            try {
                const { ok, body } = await request<IQuizQuestion>(
                    `${API_URL}/${id}`,
                    {
                        method: "PUT",
                        body: JSON.stringify(payload),
                    },
                    token
                );

                if (!ok || body.success === false || !body.data) {
                    throw new Error(
                        getMessage(body, "Unable to update question.")
                    );
                }

                setQuestions((prev) =>
                    prev.map((question) =>
                        question._id === id
                            ? body.data!
                            : question
                    )
                );

                return body.data;
            } catch (error) {
                console.error(error);

                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : NETWORK_MESSAGE
                );

                return null;
            } finally {
                setLoadingUpdateQuestion(false);
            }
        },
        [token]
    );

    /* ---------- Delete ----------
       Le backend peut renvoyer 409 si la question est liée à un quiz
       ou à une tentative. Le message du backend est conservé. */

    const deleteQuestion = useCallback(
        async (id: string): Promise<boolean> => {
            setLoadingDeleteQuestion(true);
            setErrorMsg("");

            try {
                const { ok, body } = await request(
                    `${API_URL}/${id}`,
                    {
                        method: "DELETE",
                    },
                    token
                );

                if (!ok || body.success === false) {
                    throw new Error(
                        getMessage(body, "Unable to delete question.")
                    );
                }

                await fetchQuestions();

                return true;
            } catch (error) {
                console.error(error);

                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : NETWORK_MESSAGE
                );

                return false;
            } finally {
                setLoadingDeleteQuestion(false);
            }
        },
        [fetchQuestions, token]
    );

    /* ---------- Value ---------- */

    const value = useMemo<QuestionsAdminContextType>(
        () => ({
            questions,
            totalQuestions,
            page,
            limit,
            totalPages,
            setPage,
            setLimit,
            filters,
            setFilters,
            loadingQuestions,
            refreshQuestions: fetchQuestions,

            addQuestion,
            updateQuestion,
            deleteQuestion,

            loadingAddQuestion,
            loadingUpdateQuestion,
            loadingDeleteQuestion,

            showDeletePop,
            setShowDeletePop,
            questionDelete,
            setQuestionDelete,

            errorMsg,
            setErrorMsg,
        }),
        [
            questions,
            totalQuestions,
            page,
            limit,
            totalPages,
            setPage,
            setLimit,
            filters,
            setFilters,
            loadingQuestions,
            fetchQuestions,
            addQuestion,
            updateQuestion,
            deleteQuestion,
            loadingAddQuestion,
            loadingUpdateQuestion,
            loadingDeleteQuestion,
            showDeletePop,
            questionDelete,
            errorMsg,
        ]
    );

    return (
        <QuestionsAdminContext.Provider value={value}>
            {children}
        </QuestionsAdminContext.Provider>
    );
};

/* =========================
   HOOK
========================= */

export const useQuizQuestionsAdminContext = () => {
    const context = useContext(QuestionsAdminContext);

    if (!context) {
        throw new Error(
            "useQuizQuestionsAdminContext must be used inside QuizQuestionsAdminProvider"
        );
    }

    return context;
};

