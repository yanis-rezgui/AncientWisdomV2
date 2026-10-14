import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type {
    GameDifficulty,
    WordCategory,
    WordChallenge,
} from "../../Types/Games";
import { useAuthContext } from "../AuthContext";
import type { Pagination } from "../../Types/Types";

/* =========================
   API RESPONSE TYPES
========================= */

// Ce que l'API publique renvoie pour la liste / le détail :
// le controller retire answer, hint, explanation, title et slug.
export type PublicWordChallenge = Omit<
    WordChallenge,
    "answer" | "hint" | "explanation" | "title" | "slug"
>;

// Ne contient rien qui puisse trahir la réponse (aligné sur getSafeChallenge du controller).
export interface SafeWordChallenge {
    _id: string;
    scrambledLetters: string;
    category: WordCategory;
    difficulty: GameDifficulty;
    points: number;
    hasHint: boolean;
    hint: string | null;
}

export interface WordChallengeSessionAnswer {
    challenge: string;
    challengeType: "WordChallenge";
    userAnswer?: string;
    correctAnswer?: string;
    isCorrect: boolean;
    pointsEarned: number;
    hintsUsed: number;
    timeSpent: number;
    answeredAt?: string;
}

export interface WordChallengeSession {
    _id: string;
    game: string;
    gameTitle?: string;
    gameType?: string;
    difficulty?: GameDifficulty;
    score: number;
    maxScore: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    status: "in_progress" | "completed" | "abandoned";
    startedAt: string;
    completedAt: string | null;
    durationSeconds?: number;
    answers: WordChallengeSessionAnswer[];
}

type WordChallengePagination = Pagination;

export interface WordChallengeListFilters {
    page?: number;
    limit?: number;
    difficulty?: GameDifficulty | "";
    category?: WordCategory | "";
}

export interface StartWordChallengeOptions {
    gameId: string;
    difficulty?: GameDifficulty | "";
    category?: WordCategory | "";
    questionCount?: number;
}

export interface WordChallengeAnswerResult {
    challengeId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    score: number;
    maxScore: number;
    explanation?: string;
}

export interface WordChallengeHintResult {
    challengeId: string;
    hint: string;
    hintsUsed: number;
}

export interface WordChallengeStartResult {
    session: WordChallengeSession;
    challenges: SafeWordChallenge[];
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    error?: string;
    data: T;
}

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    pagination: WordChallengePagination;
}

/* =========================
   CONTEXT TYPE
========================= */

interface WordChallengeContextType {
    // Challenge browsing
    challenges: PublicWordChallenge[];
    currentChallenge: PublicWordChallenge | null;
    pagination: WordChallengePagination | null;
    loadingChallenges: boolean;
    loadingChallenge: boolean;

    getWordChallenges: (filters?: WordChallengeListFilters) => Promise<void>;
    getWordChallenge: (id: string) => Promise<void>;

    // Gameplay
    currentSession: WordChallengeSession | null;
    sessionChallenges: SafeWordChallenge[];
    currentHint: WordChallengeHintResult | null;
    lastAnswerResult: WordChallengeAnswerResult | null;

    loadingStartGame: boolean;
    loadingHint: boolean;
    loadingAnswer: boolean;
    loadingSubmitGame: boolean;
    loadingAbandonGame: boolean;

    startWordChallengeGame: (
        options: StartWordChallengeOptions
    ) => Promise<WordChallengeStartResult | null>;

    revealWordHint: (
        sessionId: string,
        challengeId: string
    ) => Promise<WordChallengeHintResult | null>;

    submitWordAnswer: (
        sessionId: string,
        challengeId: string,
        answer: string,
        timeSpent?: number
    ) => Promise<WordChallengeAnswerResult | null>;

    submitWordChallengeGame: (sessionId: string) => Promise<void>;
    abandonWordChallengeGame: (sessionId: string) => Promise<void>;

    // Session history
    mySessions: WordChallengeSession[];
    sessionPagination: WordChallengePagination | null;
    loadingMySessions: boolean;
    loadingSession: boolean;

    getMyWordChallengeSessions: (page?: number, limit?: number) => Promise<void>;
    getWordChallengeSession: (
        sessionId: string
    ) => Promise<WordChallengeSession | null>;

    // Utilities
    clearCurrentGame: () => void;
    clearLastAnswerResult: () => void;
}

/* =========================
   CONSTANTS & HELPERS
========================= */

const WordChallengeContext = createContext<WordChallengeContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/word-scramble`;

const getErrorMessage = async (res: Response): Promise<string> => {
    try {
        const data = await res.json();
        return data.message || data.error || "An error occurred.";
    } catch {
        return "An error occurred while communicating with the server.";
    }
};

const authHeaders = (token: string | null | undefined): HeadersInit => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

/* =========================
   PROVIDER
========================= */

export const WordChallengeProvider = ({ children }: { children: ReactNode }) => {
    const { token } = useAuthContext();

    /* ----- Challenges ----- */

    const [challenges, setChallenges] = useState<PublicWordChallenge[]>([]);
    const [currentChallenge, setCurrentChallenge] =
        useState<PublicWordChallenge | null>(null);
    const [pagination, setPagination] =
        useState<WordChallengePagination | null>(null);
    const [loadingChallenges, setLoadingChallenges] = useState(false);
    const [loadingChallenge, setLoadingChallenge] = useState(false);

    /* ----- Gameplay ----- */

    const [currentSession, setCurrentSession] =
        useState<WordChallengeSession | null>(null);
    const [sessionChallenges, setSessionChallenges] = useState<
        SafeWordChallenge[]
    >([]);
    const [currentHint, setCurrentHint] =
        useState<WordChallengeHintResult | null>(null);
    const [lastAnswerResult, setLastAnswerResult] =
        useState<WordChallengeAnswerResult | null>(null);

    const [loadingStartGame, setLoadingStartGame] = useState(false);
    const [loadingHint, setLoadingHint] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(false);
    const [loadingSubmitGame, setLoadingSubmitGame] = useState(false);
    const [loadingAbandonGame, setLoadingAbandonGame] = useState(false);

    /* ----- History ----- */

    const [mySessions, setMySessions] = useState<WordChallengeSession[]>([]);
    const [sessionPagination, setSessionPagination] =
        useState<WordChallengePagination | null>(null);
    const [loadingMySessions, setLoadingMySessions] = useState(false);
    const [loadingSession, setLoadingSession] = useState(false);

    /* =========================
       GET CHALLENGES
    ========================= */

    const getWordChallenges = useCallback(
        async (filters: WordChallengeListFilters = {}) => {
            setLoadingChallenges(true);

            try {
                const params = new URLSearchParams();

                params.set("page", String(filters.page ?? 1));
                params.set("limit", String(filters.limit ?? 10));

                if (filters.difficulty) {
                    params.set("difficulty", filters.difficulty);
                }
                if (filters.category) {
                    params.set("category", filters.category);
                }

                const res = await fetch(`${API_URL}?${params.toString()}`, {
                    method: "GET",
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: PaginatedApiResponse<PublicWordChallenge> = await res.json();

                setChallenges(data.data);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Error getting word challenges:", error);
            } finally {
                setLoadingChallenges(false);
            }
        },
        []
    );

    /* =========================
       GET ONE CHALLENGE
    ========================= */

    const getWordChallenge = useCallback(async (id: string) => {
        setLoadingChallenge(true);

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "GET" });

            if (!res.ok) throw new Error(await getErrorMessage(res));

            const data: ApiResponse<PublicWordChallenge> = await res.json();
            setCurrentChallenge(data.data);
        } catch (error) {
            console.error("Error getting word challenge:", error);
            setCurrentChallenge(null);
        } finally {
            setLoadingChallenge(false);
        }
    }, []);

    /* =========================
       START GAME
    ========================= */

    const startWordChallengeGame = useCallback(
        async ({
            gameId,
            difficulty,
            category,
            questionCount = 5,
        }: StartWordChallengeOptions): Promise<WordChallengeStartResult | null> => {
            setLoadingStartGame(true);

            try {
                const res = await fetch(`${API_URL}/start`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({
                        gameId,
                        ...(difficulty ? { difficulty } : {}),
                        ...(category ? { category } : {}),
                        questionCount,
                    }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<WordChallengeStartResult> =
                    await res.json();

                setCurrentSession(data.data.session);
                setSessionChallenges(data.data.challenges);
                setCurrentHint(null);
                setLastAnswerResult(null);

                return data.data;
            } catch (error) {
                console.error("Error starting Word Scramble:", error);
                return null;
            } finally {
                setLoadingStartGame(false);
            }
        },
        [token]
    );

    /* =========================
       REVEAL HINT
    ========================= */

    const revealWordHint = useCallback(
        async (
            sessionId: string,
            challengeId: string
        ): Promise<WordChallengeHintResult | null> => {
            setLoadingHint(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/hint`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({ challengeId }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<WordChallengeHintResult> =
                    await res.json();

                setCurrentHint(data.data);

                // Garde le hint dans la question pour qu'il ne soit pas perdu au changement de question.
                setSessionChallenges((previous) =>
                    previous.map((challenge) =>
                        challenge._id === challengeId
                            ? { ...challenge, hint: data.data.hint }
                            : challenge
                    )
                );

                setCurrentSession((previous) => {
                    if (!previous) return previous;

                    return {
                        ...previous,
                        answers: previous.answers.map((answer) =>
                            answer.challenge === challengeId
                                ? { ...answer, hintsUsed: data.data.hintsUsed }
                                : answer
                        ),
                    };
                });

                return data.data;
            } catch (error) {
                console.error("Error revealing word hint:", error);
                return null;
            } finally {
                setLoadingHint(false);
            }
        },
        [token]
    );

    /* =========================
       SUBMIT ANSWER
    ========================= */

    const submitWordAnswer = useCallback(
        async (
            sessionId: string,
            challengeId: string,
            answer: string,
            timeSpent = 0
        ): Promise<WordChallengeAnswerResult | null> => {
            setLoadingAnswer(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/answer`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({ challengeId, answer, timeSpent }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<WordChallengeAnswerResult> =
                    await res.json();

                setLastAnswerResult(data.data);

                setCurrentSession((previous) => {
                    if (!previous) return previous;

                    return {
                        ...previous,
                        score: data.data.score,
                        maxScore: data.data.maxScore,
                        correctAnswers:
                            previous.correctAnswers + (data.data.isCorrect ? 1 : 0),
                        incorrectAnswers:
                            previous.incorrectAnswers + (data.data.isCorrect ? 0 : 1),
                        answers: previous.answers.map((item) =>
                            item.challenge === challengeId
                                ? {
                                      ...item,
                                      userAnswer: data.data.userAnswer,
                                      correctAnswer: data.data.correctAnswer,
                                      isCorrect: data.data.isCorrect,
                                      pointsEarned: data.data.pointsEarned,
                                      timeSpent,
                                      answeredAt: new Date().toISOString(),
                                  }
                                : item
                        ),
                    };
                });

                return data.data;
            } catch (error) {
                console.error("Error submitting word answer:", error);
                return null;
            } finally {
                setLoadingAnswer(false);
            }
        },
        [token]
    );

    /* =========================
       SUBMIT / COMPLETE GAME
    ========================= */

    const submitWordChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingSubmitGame(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/submit`, {
                    method: "POST",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<WordChallengeSession> = await res.json();
                setCurrentSession(data.data);
            } catch (error) {
                console.error("Error completing Word Scramble:", error);
            } finally {
                setLoadingSubmitGame(false);
            }
        },
        [token]
    );

    /* =========================
       ABANDON GAME
    ========================= */

    const abandonWordChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingAbandonGame(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/abandon`, {
                    method: "POST",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<WordChallengeSession> = await res.json();
                setCurrentSession(data.data);
            } catch (error) {
                console.error("Error abandoning Word Scramble:", error);
            } finally {
                setLoadingAbandonGame(false);
            }
        },
        [token]
    );

    /* =========================
       GET MY SESSIONS
    ========================= */

    const getMyWordChallengeSessions = useCallback(
        async (page = 1, limit = 10): Promise<void> => {
            setLoadingMySessions(true);

            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                const res = await fetch(`${API_URL}/sessions/me?${params.toString()}`, {
                    method: "GET",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: PaginatedApiResponse<WordChallengeSession> =
                    await res.json();

                setMySessions(data.data);
                setSessionPagination(data.pagination);
            } catch (error) {
                console.error("Error getting word challenge sessions:", error);
            } finally {
                setLoadingMySessions(false);
            }
        },
        [token]
    );

    /* =========================
       GET ONE SESSION
    ========================= */

    const getWordChallengeSession = useCallback(
        async (sessionId: string): Promise<WordChallengeSession | null> => {
            setLoadingSession(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
                    method: "GET",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<WordChallengeSession> = await res.json();
                setCurrentSession(data.data);

                return data.data;
            } catch (error) {
                console.error("Error getting word challenge session:", error);
                return null;
            } finally {
                setLoadingSession(false);
            }
        },
        [token]
    );

    /* =========================
       UTILITIES
    ========================= */

    const clearCurrentGame = useCallback(() => {
        setCurrentSession(null);
        setSessionChallenges([]);
        setCurrentHint(null);
        setLastAnswerResult(null);
    }, []);

    const clearLastAnswerResult = useCallback(() => {
        setLastAnswerResult(null);
    }, []);

    return (
        <WordChallengeContext.Provider
            value={{
                challenges,
                currentChallenge,
                pagination,
                loadingChallenges,
                loadingChallenge,
                getWordChallenges,
                getWordChallenge,

                currentSession,
                sessionChallenges,
                currentHint,
                lastAnswerResult,
                loadingStartGame,
                loadingHint,
                loadingAnswer,
                loadingSubmitGame,
                loadingAbandonGame,
                startWordChallengeGame,
                revealWordHint,
                submitWordAnswer,
                submitWordChallengeGame,
                abandonWordChallengeGame,

                mySessions,
                sessionPagination,
                loadingMySessions,
                loadingSession,
                getMyWordChallengeSessions,
                getWordChallengeSession,

                clearCurrentGame,
                clearLastAnswerResult,
            }}
        >
            {children}
        </WordChallengeContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useWordChallengeContext = () => {
    const context = useContext(WordChallengeContext);

    if (!context) {
        throw new Error(
            "Please use useWordChallengeContext inside WordChallengeProvider"
        );
    }

    return context;
};