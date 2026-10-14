import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type {
    FigureChallenge,
    FigureClue,
    GameDifficulty,
   
} from "../../Types/Games";
import { useAuthContext } from "../AuthContext";
import type { Pagination } from "../../Types/Types";

/* =========================
   API RESPONSE TYPES
========================= */

export interface SafeFigureChallenge {
    _id: string;
    title: string;
    slug: string;
    image: FigureChallenge["image"];
    difficulty: GameDifficulty;
    tags: string[];
    clues: FigureClue[];
    cluesRevealed: number;
    totalClues: number;
}

export interface FigureChallengeSessionAnswer {
    challenge: string;
    challengeType: "FigureChallenge";
    userAnswer?: string;
    correctAnswer?: string;
    isCorrect: boolean;
    pointsEarned: number;
    hintsUsed: number;
    timeSpent: number;
    answeredAt?: string;
}

export interface FigureChallengeSession {
    _id: string;
    game: string;
    gameTitle?: string;
    gameType?: string;
    score: number;
    maxScore: number;
    status: "in_progress" | "completed" | "abandoned";
    startedAt: string;
    completedAt: string | null;
    durationSeconds?: number;
    answers: FigureChallengeSessionAnswer[];
}

type FigureChallengePagination = Pagination;

export interface FigureChallengeListFilters {
    page?: number;
    limit?: number;
    search?: string;
    difficulty?: GameDifficulty | "";
    tags?: string[];
}

export interface StartFigureChallengeOptions {
    gameId: string;
    difficulty?: GameDifficulty | "";
    questionCount?: number;
}

export interface FigureChallengeAnswerResult {
    challengeId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    score: number;
    maxScore: number;
    explanation?: string;
    historicalContext?: string;
}

export interface FigureChallengeHintResult {
    challengeId: string;
    clue: FigureClue;
    cluesRevealed: number;
    totalClues: number;
}

export interface FigureChallengeStartResult {
    session: FigureChallengeSession;
    challenges: SafeFigureChallenge[];
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    error?: string;
    data: T;
}

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    pagination: FigureChallengePagination;
}

/* =========================
   CONTEXT TYPE
========================= */

interface FigureChallengeContextType {
    // Challenge browsing
    challenges: FigureChallenge[];
    currentChallenge: FigureChallenge | null;
    pagination: FigureChallengePagination | null;
    loadingChallenges: boolean;
    loadingChallenge: boolean;

    getFigureChallenges: (filters?: FigureChallengeListFilters) => Promise<void>;
    getFigureChallenge: (id: string) => Promise<void>;

    // Gameplay
    currentSession: FigureChallengeSession | null;
    sessionChallenges: SafeFigureChallenge[];
    currentHint: FigureChallengeHintResult | null;
    lastAnswerResult: FigureChallengeAnswerResult | null;

    loadingStartGame: boolean;
    loadingHint: boolean;
    loadingAnswer: boolean;
    loadingSubmitGame: boolean;
    loadingAbandonGame: boolean;

    startFigureChallengeGame: (
        options: StartFigureChallengeOptions
    ) => Promise<FigureChallengeStartResult | null>;

    revealFigureHint: (
        sessionId: string,
        challengeId: string
    ) => Promise<FigureChallengeHintResult | null>;

    submitFigureAnswer: (
        sessionId: string,
        challengeId: string,
        answer: string,
        timeSpent?: number
    ) => Promise<FigureChallengeAnswerResult | null>;

    submitFigureChallengeGame: (sessionId: string) => Promise<void>;
    abandonFigureChallengeGame: (sessionId: string) => Promise<void>;

    // Session history
    mySessions: FigureChallengeSession[];
    sessionPagination: FigureChallengePagination | null;
    loadingMySessions: boolean;
    loadingSession: boolean;

    getMyFigureChallengeSessions: (page?: number, limit?: number) => Promise<void>;
    getFigureChallengeSession: (
        sessionId: string
    ) => Promise<FigureChallengeSession | null>;

    // Utilities
    clearCurrentGame: () => void;
    clearLastAnswerResult: () => void;
}

/* =========================
   CONSTANTS & HELPERS
========================= */

const FigureChallengeContext =
    createContext<FigureChallengeContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/figure-challenges`;

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

export const FigureChallengeProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { token } = useAuthContext();

    /* ----- Challenges ----- */

    const [challenges, setChallenges] = useState<FigureChallenge[]>([]);
    const [currentChallenge, setCurrentChallenge] =
        useState<FigureChallenge | null>(null);
    const [pagination, setPagination] =
        useState<FigureChallengePagination | null>(null);
    const [loadingChallenges, setLoadingChallenges] = useState(false);
    const [loadingChallenge, setLoadingChallenge] = useState(false);

    /* ----- Gameplay ----- */

    const [currentSession, setCurrentSession] =
        useState<FigureChallengeSession | null>(null);
    const [sessionChallenges, setSessionChallenges] = useState<
        SafeFigureChallenge[]
    >([]);
    const [currentHint, setCurrentHint] =
        useState<FigureChallengeHintResult | null>(null);
    const [lastAnswerResult, setLastAnswerResult] =
        useState<FigureChallengeAnswerResult | null>(null);

    const [loadingStartGame, setLoadingStartGame] = useState(false);
    const [loadingHint, setLoadingHint] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(false);
    const [loadingSubmitGame, setLoadingSubmitGame] = useState(false);
    const [loadingAbandonGame, setLoadingAbandonGame] = useState(false);

    /* ----- History ----- */

    const [mySessions, setMySessions] = useState<FigureChallengeSession[]>([]);
    const [sessionPagination, setSessionPagination] =
        useState<FigureChallengePagination | null>(null);
    const [loadingMySessions, setLoadingMySessions] = useState(false);
    const [loadingSession, setLoadingSession] = useState(false);

    /* =========================
       GET CHALLENGES
    ========================= */

    const getFigureChallenges = useCallback(
        async (filters: FigureChallengeListFilters = {}) => {
            setLoadingChallenges(true);

            try {
                const params = new URLSearchParams();

                params.set("page", String(filters.page ?? 1));
                params.set("limit", String(filters.limit ?? 10));

                if (filters.search?.trim()) {
                    params.set("search", filters.search.trim());
                }
                if (filters.difficulty) {
                    params.set("difficulty", filters.difficulty);
                }
                if (filters.tags?.length) {
                    params.set("tags", filters.tags.join(","));
                }

                const res = await fetch(`${API_URL}?${params.toString()}`, {
                    method: "GET",
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: PaginatedApiResponse<FigureChallenge> =
                    await res.json();

                setChallenges(data.data);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Error getting figure challenges:", error);
            } finally {
                setLoadingChallenges(false);
            }
        },
        []
    );

    /* =========================
       GET ONE CHALLENGE
    ========================= */

    const getFigureChallenge = useCallback(async (id: string) => {
        setLoadingChallenge(true);

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "GET" });

            if (!res.ok) throw new Error(await getErrorMessage(res));

            const data: ApiResponse<FigureChallenge> = await res.json();
            setCurrentChallenge(data.data);
        } catch (error) {
            console.error("Error getting figure challenge:", error);
            setCurrentChallenge(null);
        } finally {
            setLoadingChallenge(false);
        }
    }, []);

    /* =========================
       START GAME
    ========================= */

    const startFigureChallengeGame = useCallback(
        async ({
            gameId,
            difficulty,
            questionCount = 5,
        }: StartFigureChallengeOptions): Promise<FigureChallengeStartResult | null> => {
            setLoadingStartGame(true);

            try {
                const res = await fetch(`${API_URL}/start`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({
                        gameId,
                        ...(difficulty ? { difficulty } : {}),
                        questionCount,
                    }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<FigureChallengeStartResult> =
                    await res.json();

                setCurrentSession(data.data.session);
                setSessionChallenges(data.data.challenges);
                setCurrentHint(null);
                setLastAnswerResult(null);

                return data.data;
            } catch (error) {
                console.error("Error starting Guess the Figure:", error);
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

    const revealFigureHint = useCallback(
        async (
            sessionId: string,
            challengeId: string
        ): Promise<FigureChallengeHintResult | null> => {
            setLoadingHint(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/hint`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({ challengeId }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<FigureChallengeHintResult> =
                    await res.json();

                setCurrentHint(data.data);

                // Ajoute le nouvel indice à la liste des indices déjà révélés
                setSessionChallenges((previous) =>
                    previous.map((challenge) =>
                        challenge._id === challengeId
                            ? {
                                  ...challenge,
                                  clues: [...challenge.clues, data.data.clue],
                                  cluesRevealed: data.data.cluesRevealed,
                                  totalClues: data.data.totalClues,
                              }
                            : challenge
                    )
                );

                setCurrentSession((previous) => {
                    if (!previous) return previous;

                    return {
                        ...previous,
                        answers: previous.answers.map((answer) =>
                            answer.challenge === challengeId
                                ? { ...answer, hintsUsed: data.data.cluesRevealed }
                                : answer
                        ),
                    };
                });

                return data.data;
            } catch (error) {
                console.error("Error revealing figure hint:", error);
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

    const submitFigureAnswer = useCallback(
        async (
            sessionId: string,
            challengeId: string,
            answer: string,
            timeSpent = 0
        ): Promise<FigureChallengeAnswerResult | null> => {
            setLoadingAnswer(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/answer`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({ challengeId, answer, timeSpent }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<FigureChallengeAnswerResult> =
                    await res.json();

                setLastAnswerResult(data.data);

                setCurrentSession((previous) => {
                    if (!previous) return previous;

                    return {
                        ...previous,
                        score: data.data.score,
                        maxScore: data.data.maxScore,
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
                console.error("Error submitting figure answer:", error);
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

    const submitFigureChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingSubmitGame(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/submit`, {
                    method: "POST",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<FigureChallengeSession> = await res.json();
                setCurrentSession(data.data);
            } catch (error) {
                console.error("Error completing Guess the Figure:", error);
            } finally {
                setLoadingSubmitGame(false);
            }
        },
        [token]
    );

    /* =========================
       ABANDON GAME
    ========================= */

    const abandonFigureChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingAbandonGame(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/abandon`, {
                    method: "POST",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<FigureChallengeSession> = await res.json();
                setCurrentSession(data.data);
            } catch (error) {
                console.error("Error abandoning Guess the Figure:", error);
            } finally {
                setLoadingAbandonGame(false);
            }
        },
        [token]
    );

    /* =========================
       GET MY SESSIONS
    ========================= */

    const getMyFigureChallengeSessions = useCallback(
        async (page = 1, limit = 10): Promise<void> => {
            setLoadingMySessions(true);

            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                const res = await fetch(`${API_URL}/sessions/me?${params}`, {
                    method: "GET",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: PaginatedApiResponse<FigureChallengeSession> =
                    await res.json();

                setMySessions(data.data);
                setSessionPagination(data.pagination);
            } catch (error) {
                console.error("Error getting figure challenge sessions:", error);
            } finally {
                setLoadingMySessions(false);
            }
        },
        [token]
    );

    /* =========================
       GET ONE SESSION
    ========================= */

    const getFigureChallengeSession = useCallback(
        async (sessionId: string): Promise<FigureChallengeSession | null> => {
            setLoadingSession(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
                    method: "GET",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<FigureChallengeSession> = await res.json();
                setCurrentSession(data.data);

                return data.data;
            } catch (error) {
                console.error("Error getting figure challenge session:", error);
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
        <FigureChallengeContext.Provider
            value={{
                challenges,
                currentChallenge,
                pagination,
                loadingChallenges,
                loadingChallenge,
                getFigureChallenges,
                getFigureChallenge,

                currentSession,
                sessionChallenges,
                currentHint,
                lastAnswerResult,
                loadingStartGame,
                loadingHint,
                loadingAnswer,
                loadingSubmitGame,
                loadingAbandonGame,
                startFigureChallengeGame,
                revealFigureHint,
                submitFigureAnswer,
                submitFigureChallengeGame,
                abandonFigureChallengeGame,

                mySessions,
                sessionPagination,
                loadingMySessions,
                loadingSession,
                getMyFigureChallengeSessions,
                getFigureChallengeSession,

                clearCurrentGame,
                clearLastAnswerResult,
            }}
        >
            {children}
        </FigureChallengeContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useFigureChallengeContext = () => {
    const context = useContext(FigureChallengeContext);

    if (!context) {
        throw new Error(
            "Please use useFigureChallengeContext inside FigureChallengeProvider"
        );
    }

    return context;
};