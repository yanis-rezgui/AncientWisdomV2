import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type {
    Pagination,
    QuizAttempt,
    QuizDifficulty,
} from "../Types/Types";
import type { PlayableQuiz, QuizAttemptSummary, QuizListItem } from "../Types/QuizPlayTypes";
import { useAuthContext } from "./AuthContext";



/* =========================
   API HELPERS
========================= */

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const AUTH_MESSAGE = "Please sign in to take part in the quizzes.";
const NETWORK_MESSAGE = "Network error. Check your connection and try again.";

type ApiBody<T> = {
    success?: boolean;
    message?: string;
    error?: string;
    data?: T;
    pagination?: Pagination;
};

// If your authorize middleware reads a Bearer token instead of a cookie,
// add the Authorization header here.

const request = async <T,>(
    path: string,
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

    const res = await fetch(`${API_URL}${path}`, {
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

const getRefId = (ref: string | { _id: string }) =>
    typeof ref === "string" ? ref : ref._id;


/* =========================
   CONTEXT TYPE
========================= */

type SaveResult = "saved" | "expired" | "error";

interface QuizContextType {

    // Quiz list
    quizzes: QuizListItem[];
    loadingQuizzes: boolean;
    page: number;
    setPage: Dispatch<SetStateAction<number>>;
    limit: number;
    setLimit: Dispatch<SetStateAction<number>>;
    totalQuizzes: number;
    totalPages: number;
    search: string;
    setSearch: (search: string) => void;
    difficulty: QuizDifficulty | "";
    setDifficulty: (difficulty: QuizDifficulty | "") => void;
    era: string;
    setEra: (era: string) => void;
    resetFilters: () => void;

    // Single quiz
    currentQuiz: PlayableQuiz | null;
    loadingQuiz: boolean;
    getQuiz: (id: string, silent?: boolean) => Promise<PlayableQuiz | null>;

    // Playing
    attempt: QuizAttempt | null;
    loadingAttempt: boolean;
    submitting: boolean;
    startQuiz: (quizId: string) => Promise<QuizAttempt | null>;
    getAttempt: (attemptId: string) => Promise<QuizAttempt | null>;
    saveAnswer: (questionId: string, selectedAnswerIndex: number) => Promise<SaveResult>;
    submitQuiz: () => Promise<QuizAttempt | null>;
    abandonQuiz: () => Promise<boolean>;

    // History
    myAttempts: QuizAttemptSummary[];
    loadingMyAttempts: boolean;
    historyTotal: number;
    historyTotalPages: number;
    getMyAttempts: (page?: number, limit?: number) => Promise<void>;

    // Errors
    quizError: string | null;
    clearQuizError: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);


/* =========================
   PROVIDER
========================= */

export const QuizProvider = ({ children }: { children: ReactNode }) => {

    // ----- list -----
    const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(9);
    const [totalQuizzes, setTotalQuizzes] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearchState] = useState<string>("");
    const [difficulty, setDifficultyState] = useState<QuizDifficulty | "">("");
    const [era, setEraState] = useState<string>("");

    // ----- single quiz -----
    const [currentQuiz, setCurrentQuiz] = useState<PlayableQuiz | null>(null);
    const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);

    // ----- attempt -----
    const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
    const [loadingAttempt, setLoadingAttempt] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // ----- history -----
    const [myAttempts, setMyAttempts] = useState<QuizAttemptSummary[]>([]);
    const [loadingMyAttempts, setLoadingMyAttempts] = useState<boolean>(false);
    const [historyTotal, setHistoryTotal] = useState(0);
    const [historyTotalPages, setHistoryTotalPages] = useState(0);

    const [quizError, setQuizError] = useState<string | null>(null);

    const {token} = useAuthContext();

    const listRequestId = useRef(0);
    // Answers are sent one after the other so that submit never overtakes a save.
    const saveQueue = useRef<Promise<unknown>>(Promise.resolve());


    const clearQuizError = () => setQuizError(null);


    /* ---------- filters (always go back to page 1) ---------- */

    const setSearch = (value: string) => { setSearchState(value); setPage(1); };
    const setDifficulty = (value: QuizDifficulty | "") => { setDifficultyState(value); setPage(1); };
    const setEra = (value: string) => { setEraState(value); setPage(1); };

    const resetFilters = () => {
        setSearchState("");
        setDifficultyState("");
        setEraState("");
        setPage(1);
    };


    /* ---------- quiz list ---------- */

    const getQuizzes = useCallback(async () => {

        const requestId = ++listRequestId.current;
        setLoadingQuizzes(true);

        try {

            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if (search) params.append("search", search);
            if (difficulty) params.append("difficulty", difficulty);
            if (era) params.append("era", era);

            const { ok, body } = await request<QuizListItem[]>(`/quizzes?${params.toString()}`);

            // A newer request has started, ignore this one.
            if (requestId !== listRequestId.current) return;

            if (!ok) {
                throw new Error(getMessage(body, "Error in fetching quizzes"));
            }

            setQuizzes(body.data ?? []);
            setTotalQuizzes(body.pagination?.total ?? 0);
            setTotalPages(body.pagination?.totalPages ?? 0);

        } catch (err) {
            if (requestId === listRequestId.current) {
                console.error(err);
                setQuizzes([]);
            }
        } finally {
            if (requestId === listRequestId.current) {
                setLoadingQuizzes(false);
            }
        }
    }, [page, limit, search, difficulty, era]);

    useEffect(() => {
        getQuizzes();
    }, [getQuizzes]);


    /* ---------- single quiz ---------- */

    const getQuiz = async (id: string, silent = false) => {

        setLoadingQuiz(true);
        if (!silent) setQuizError(null);

        try {

            const { ok, body } = await request<PlayableQuiz>(`/quizzes/${id}`);

            if (!ok || !body.data) {
                if (!silent) setQuizError(getMessage(body, "This quiz could not be found."));
                return null;
            }

            setCurrentQuiz(body.data);
            return body.data;

        } catch (err) {
            console.error(err);
            if (!silent) setQuizError(NETWORK_MESSAGE);
            return null;
        } finally {
            setLoadingQuiz(false);
        }
    };


    /* ---------- start / resume ---------- */

    const startQuiz = async (quizId: string) => {

        setLoadingAttempt(true);
        setQuizError(null);

        try {

            const { ok, status, body } = await request<QuizAttempt>(
                `/quizzes/${quizId}/start`,
                { method: "POST" },
                token
            );

            // 409 = the old attempt had run out of time and was just finalized.
            if ((ok || status === 409) && body.data) {
                setAttempt(body.data);
                return body.data;
            }

            setQuizError(
                status === 401 ? AUTH_MESSAGE : getMessage(body, "Unable to start this quiz.")
            );
            return null;

        } catch (err) {
            console.error(err);
            setQuizError(NETWORK_MESSAGE);
            return null;
        } finally {
            setLoadingAttempt(false);
        }
    };


    /* ---------- load an attempt (refresh-safe) ---------- */

    const getAttempt = async (attemptId: string) => {

        setLoadingAttempt(true);
        setQuizError(null);

        try {

            const { ok, status, body } = await request<QuizAttempt>(`/quiz-attempts/${attemptId}`,
                {},
                token
            );

            if (!ok || !body.data) {
                setQuizError(
                    status === 401 ? AUTH_MESSAGE : getMessage(body, "This attempt could not be found.")
                );
                return null;
            }

            setAttempt(body.data);
            return body.data;

        } catch (err) {
            console.error(err);
            setQuizError(NETWORK_MESSAGE);
            return null;
        } finally {
            setLoadingAttempt(false);
        }
    };


    /* ---------- save an answer (optimistic) ---------- */

    const patchAnswer = (questionId: string, value: number | null) => {
        setAttempt((prev) =>
            prev
                ? {
                    ...prev,
                    answers: prev.answers.map((answer) =>
                        getRefId(answer.question) === questionId
                            ? { ...answer, selectedAnswerIndex: value }
                            : answer
                    ),
                }
                : prev
        );
    };

    const saveAnswer = (questionId: string, selectedAnswerIndex: number): Promise<SaveResult> => {

        if (!attempt) return Promise.resolve("error");

        const attemptId = attempt._id;
        const previous =
            attempt.answers.find((a) => getRefId(a.question) === questionId)
                ?.selectedAnswerIndex ?? null;

        // The UI reacts instantly, the server catches up right after.
        patchAnswer(questionId, selectedAnswerIndex);

        const send = async (): Promise<SaveResult> => {
            try {

                const { ok, status, body } = await request<QuizAttempt>(
                    `/quiz-attempts/${attemptId}/answer`,
                    {
                        method: "POST",
                        body: JSON.stringify({ questionId, selectedAnswerIndex }),
                    },
                    token
                );

                if (ok) return "saved";

                // Time limit reached: the server already submitted the quiz.
                if (status === 409 && body.data) {
                    setAttempt(body.data);
                    return "expired";
                }

                patchAnswer(questionId, previous);
                setQuizError(getMessage(body, "Your answer could not be saved."));
                return "error";

            } catch (err) {
                console.error(err);
                patchAnswer(questionId, previous);
                setQuizError(NETWORK_MESSAGE);
                return "error";
            }
        };

        const task = saveQueue.current.then(send);
        saveQueue.current = task;
        return task;
    };


    /* ---------- submit ---------- */

    const submitQuiz = async () => {

        if (!attempt) return null;

        setSubmitting(true);
        setQuizError(null);

        try {

            // Wait for pending answers first.
            await saveQueue.current;

            const { ok, body } = await request<QuizAttempt>(
                `/quiz-attempts/${attempt._id}/submit`,
                { method: "POST" },
                token
            );

            if (!ok || !body.data) {
                setQuizError(getMessage(body, "The quiz could not be submitted."));
                return null;
            }

            setAttempt(body.data);
            return body.data;

        } catch (err) {
            console.error(err);
            setQuizError(NETWORK_MESSAGE);
            return null;
        } finally {
            setSubmitting(false);
        }
    };


    /* ---------- abandon ---------- */

    const abandonQuiz = async () => {

        if (!attempt) return false;

        setSubmitting(true);
        setQuizError(null);

        try {

            await saveQueue.current;

            const { ok, body } = await request(
                `/quiz-attempts/${attempt._id}/abandon`,
                { method: "POST" },
                token
            );

            if (!ok) {
                setQuizError(getMessage(body, "The quiz could not be abandoned."));
                return false;
            }

            setAttempt(null);
            return true;

        } catch (err) {
            console.error(err);
            setQuizError(NETWORK_MESSAGE);
            return false;
        } finally {
            setSubmitting(false);
        }
    };


    /* ---------- history ---------- */

    const getMyAttempts = useCallback(async (pageNumber = 1, limitNumber = 10) => {

        setLoadingMyAttempts(true);
        setQuizError(null);

        try {

            const params = new URLSearchParams();
            params.append("page", pageNumber.toString());
            params.append("limit", limitNumber.toString());

            const { ok, status, body } = await request<QuizAttemptSummary[]>(
                `/quiz-attempts/me?${params.toString()}`,
                {},
                token
            );

            if (!ok) {
                setMyAttempts([]);
                setQuizError(
                    status === 401 ? AUTH_MESSAGE : getMessage(body, "Your history could not be loaded.")
                );
                return;
            }

            setMyAttempts(body.data ?? []);
            setHistoryTotal(body.pagination?.total ?? 0);
            setHistoryTotalPages(body.pagination?.totalPages ?? 0);

        } catch (err) {
            console.error(err);
            setQuizError(NETWORK_MESSAGE);
        } finally {
            setLoadingMyAttempts(false);
        }
    }, []);


    return (
        <QuizContext.Provider value={{
            quizzes,
            loadingQuizzes,
            page,
            setPage,
            limit,
            setLimit,
            totalQuizzes,
            totalPages,
            search,
            setSearch,
            difficulty,
            setDifficulty,
            era,
            setEra,
            resetFilters,

            currentQuiz,
            loadingQuiz,
            getQuiz,

            attempt,
            loadingAttempt,
            submitting,
            startQuiz,
            getAttempt,
            saveAnswer,
            submitQuiz,
            abandonQuiz,

            myAttempts,
            loadingMyAttempts,
            historyTotal,
            historyTotalPages,
            getMyAttempts,

            quizError,
            clearQuizError,
        }}>
            {children}
        </QuizContext.Provider>
    );
};


export const useQuizContext = () => {

    const context = useContext(QuizContext);
    if (!context) {
        throw new Error("useQuizContext must be used within a QuizProvider");
    }
    return context;
};