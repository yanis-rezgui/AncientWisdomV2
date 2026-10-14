import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type {
    LandmarkChallenge,
    GameDifficulty,
} from "../../Types/Games";

import { useAuthContext } from "../AuthContext";
import type { Pagination } from "../../Types/Types";

/* =========================
   API RESPONSE TYPES
========================= */

// Ne contient rien qui puisse trahir la réponse (aligné sur getSafeChallenge du controller).
export interface SafeLandmarkChallenge {
    _id: string;
    image: LandmarkChallenge["image"];
    options: string[];
    difficulty: GameDifficulty;
    hasHint: boolean;
    hint: string | null;
}

export interface LandmarkChallengeSessionAnswer {
    challenge: string;
    challengeType: "LandmarkChallenge";
    userAnswer?: string;
    correctAnswer?: string;
    isCorrect: boolean;
    pointsEarned: number;
    hintsUsed: number;
    timeSpent: number;
    answeredAt?: string;
}

export interface LandmarkChallengeSession {
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
    answers: LandmarkChallengeSessionAnswer[];
}

type LandmarkChallengePagination = Pagination;

// Le controller n'accepte plus search ni tags (ils permettaient de deviner la réponse).
export interface LandmarkChallengeListFilters {
    page?: number;
    limit?: number;
    difficulty?: GameDifficulty | "";
}

export interface StartLandmarkChallengeOptions {
    gameId: string;
    difficulty?: GameDifficulty | "";
    questionCount?: number;
}

export interface LandmarkChallengeAnswerResult {
    challengeId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    score: number;
    maxScore: number;
    explanation?: string;
    location?: string;
    civilization?: string;
}

export interface LandmarkChallengeHintResult {
    challengeId: string;
    hint: string;
    hintsUsed: number;
}

export interface LandmarkChallengeStartResult {
    session: LandmarkChallengeSession;
    challenges: SafeLandmarkChallenge[];
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    error?: string;
    data: T;
}

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    pagination: LandmarkChallengePagination;
}

/* =========================
   CONTEXT TYPE
========================= */

interface LandmarkChallengeContextType {
    // Challenge browsing
    challenges: LandmarkChallenge[];
    currentChallenge: LandmarkChallenge | null;
    pagination: LandmarkChallengePagination | null;
    loadingChallenges: boolean;
    loadingChallenge: boolean;

    getLandmarkChallenges: (
        filters?: LandmarkChallengeListFilters
    ) => Promise<void>;

    getLandmarkChallenge: (id: string) => Promise<void>;

    // Gameplay
    currentSession: LandmarkChallengeSession | null;
    sessionChallenges: SafeLandmarkChallenge[];
    currentHint: LandmarkChallengeHintResult | null;
    lastAnswerResult: LandmarkChallengeAnswerResult | null;

    loadingStartGame: boolean;
    loadingHint: boolean;
    loadingAnswer: boolean;
    loadingSubmitGame: boolean;
    loadingAbandonGame: boolean;

    startLandmarkChallengeGame: (
        options: StartLandmarkChallengeOptions
    ) => Promise<LandmarkChallengeStartResult | null>;

    revealLandmarkHint: (
        sessionId: string,
        challengeId: string
    ) => Promise<LandmarkChallengeHintResult | null>;

    submitLandmarkAnswer: (
        sessionId: string,
        challengeId: string,
        answer: string,
        timeSpent?: number
    ) => Promise<LandmarkChallengeAnswerResult | null>;

    submitLandmarkChallengeGame: (
        sessionId: string
    ) => Promise<void>;

    abandonLandmarkChallengeGame: (
        sessionId: string
    ) => Promise<void>;

    // Session history
    mySessions: LandmarkChallengeSession[];
    sessionPagination: LandmarkChallengePagination | null;
    loadingMySessions: boolean;
    loadingSession: boolean;

    getMyLandmarkChallengeSessions: (
        page?: number,
        limit?: number
    ) => Promise<void>;

    getLandmarkChallengeSession: (
        sessionId: string
    ) => Promise<LandmarkChallengeSession | null>;

    // Utilities
    clearCurrentGame: () => void;
    clearLastAnswerResult: () => void;
}

/* =========================
   CONSTANTS & HELPERS
========================= */

const LandmarkChallengeContext =
    createContext<LandmarkChallengeContextType | null>(null);

const API_URL = `${
    import.meta.env.VITE_API_URL
}/api/v1/landmark-challenges`;

const getErrorMessage = async (res: Response): Promise<string> => {
    try {
        const data = await res.json();

        return (
            data.message ||
            data.error ||
            "An error occurred."
        );
    } catch {
        return "An error occurred while communicating with the server.";
    }
};

const authHeaders = (
    token: string | null | undefined
): HeadersInit => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
});

/* =========================
   PROVIDER
========================= */

export const LandmarkChallengeProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { token } = useAuthContext();

    /* ----- Challenges ----- */

    const [challenges, setChallenges] =
        useState<LandmarkChallenge[]>([]);

    const [currentChallenge, setCurrentChallenge] =
        useState<LandmarkChallenge | null>(null);

    const [pagination, setPagination] =
        useState<LandmarkChallengePagination | null>(null);

    const [loadingChallenges, setLoadingChallenges] =
        useState(false);

    const [loadingChallenge, setLoadingChallenge] =
        useState(false);

    /* ----- Gameplay ----- */

    const [currentSession, setCurrentSession] =
        useState<LandmarkChallengeSession | null>(null);

    const [sessionChallenges, setSessionChallenges] =
        useState<SafeLandmarkChallenge[]>([]);

    const [currentHint, setCurrentHint] =
        useState<LandmarkChallengeHintResult | null>(null);

    const [lastAnswerResult, setLastAnswerResult] =
        useState<LandmarkChallengeAnswerResult | null>(null);

    const [loadingStartGame, setLoadingStartGame] =
        useState(false);

    const [loadingHint, setLoadingHint] =
        useState(false);

    const [loadingAnswer, setLoadingAnswer] =
        useState(false);

    const [loadingSubmitGame, setLoadingSubmitGame] =
        useState(false);

    const [loadingAbandonGame, setLoadingAbandonGame] =
        useState(false);

    /* ----- History ----- */

    const [mySessions, setMySessions] =
        useState<LandmarkChallengeSession[]>([]);

    const [sessionPagination, setSessionPagination] =
        useState<LandmarkChallengePagination | null>(null);

    const [loadingMySessions, setLoadingMySessions] =
        useState(false);

    const [loadingSession, setLoadingSession] =
        useState(false);

    /* =========================
       GET CHALLENGES
    ========================= */

    const getLandmarkChallenges = useCallback(
        async (filters: LandmarkChallengeListFilters = {}) => {
            setLoadingChallenges(true);

            try {
                const params = new URLSearchParams();

                params.set("page", String(filters.page ?? 1));
                params.set("limit", String(filters.limit ?? 10));

                if (filters.difficulty) {
                    params.set("difficulty", filters.difficulty);
                }

                const res = await fetch(
                    `${API_URL}?${params.toString()}`,
                    { method: "GET" }
                );

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: PaginatedApiResponse<LandmarkChallenge> =
                    await res.json();

                setChallenges(data.data);
                setPagination(data.pagination);
            } catch (error) {
                console.error(
                    "Error getting landmark challenges:",
                    error
                );
            } finally {
                setLoadingChallenges(false);
            }
        },
        []
    );

    /* =========================
       GET ONE CHALLENGE
    ========================= */

    const getLandmarkChallenge = useCallback(
        async (id: string) => {
            setLoadingChallenge(true);

            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "GET",
                });

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: ApiResponse<LandmarkChallenge> =
                    await res.json();

                setCurrentChallenge(data.data);
            } catch (error) {
                console.error(
                    "Error getting landmark challenge:",
                    error
                );

                setCurrentChallenge(null);
            } finally {
                setLoadingChallenge(false);
            }
        },
        []
    );

    /* =========================
       START GAME
    ========================= */

    const startLandmarkChallengeGame = useCallback(
        async ({
            gameId,
            difficulty,
            questionCount = 5,
        }: StartLandmarkChallengeOptions): Promise<LandmarkChallengeStartResult | null> => {
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

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: ApiResponse<LandmarkChallengeStartResult> =
                    await res.json();

                setCurrentSession(data.data.session);
                setSessionChallenges(data.data.challenges);
                setCurrentHint(null);
                setLastAnswerResult(null);

                return data.data;
            } catch (error) {
                console.error(
                    "Error starting Name the Landmark:",
                    error
                );

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

    const revealLandmarkHint = useCallback(
        async (
            sessionId: string,
            challengeId: string
        ): Promise<LandmarkChallengeHintResult | null> => {
            setLoadingHint(true);

            try {
                const res = await fetch(
                    `${API_URL}/sessions/${sessionId}/hint`,
                    {
                        method: "POST",
                        headers: authHeaders(token),
                        body: JSON.stringify({ challengeId }),
                    }
                );

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: ApiResponse<LandmarkChallengeHintResult> =
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
                                ? {
                                      ...answer,
                                      hintsUsed: data.data.hintsUsed,
                                  }
                                : answer
                        ),
                    };
                });

                return data.data;
            } catch (error) {
                console.error(
                    "Error revealing landmark hint:",
                    error
                );

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

    const submitLandmarkAnswer = useCallback(
        async (
            sessionId: string,
            challengeId: string,
            answer: string,
            timeSpent = 0
        ): Promise<LandmarkChallengeAnswerResult | null> => {
            setLoadingAnswer(true);

            try {
                const res = await fetch(
                    `${API_URL}/sessions/${sessionId}/answer`,
                    {
                        method: "POST",
                        headers: authHeaders(token),
                        body: JSON.stringify({
                            challengeId,
                            answer,
                            timeSpent,
                        }),
                    }
                );

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: ApiResponse<LandmarkChallengeAnswerResult> =
                    await res.json();

                setLastAnswerResult(data.data);

                setCurrentSession((previous) => {
                    if (!previous) return previous;

                    return {
                        ...previous,
                        score: data.data.score,
                        maxScore: data.data.maxScore,
                        correctAnswers:
                            previous.correctAnswers +
                            (data.data.isCorrect ? 1 : 0),
                        incorrectAnswers:
                            previous.incorrectAnswers +
                            (data.data.isCorrect ? 0 : 1),
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
                console.error(
                    "Error submitting landmark answer:",
                    error
                );

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

    const submitLandmarkChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingSubmitGame(true);

            try {
                const res = await fetch(
                    `${API_URL}/sessions/${sessionId}/submit`,
                    {
                        method: "POST",
                        headers: authHeaders(token),
                    }
                );

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: ApiResponse<LandmarkChallengeSession> =
                    await res.json();

                setCurrentSession(data.data);
            } catch (error) {
                console.error(
                    "Error completing Name the Landmark:",
                    error
                );
            } finally {
                setLoadingSubmitGame(false);
            }
        },
        [token]
    );

    /* =========================
       ABANDON GAME
    ========================= */

    const abandonLandmarkChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingAbandonGame(true);

            try {
                const res = await fetch(
                    `${API_URL}/sessions/${sessionId}/abandon`,
                    {
                        method: "POST",
                        headers: authHeaders(token),
                    }
                );

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: ApiResponse<LandmarkChallengeSession> =
                    await res.json();

                setCurrentSession(data.data);
            } catch (error) {
                console.error(
                    "Error abandoning Name the Landmark:",
                    error
                );
            } finally {
                setLoadingAbandonGame(false);
            }
        },
        [token]
    );

    /* =========================
       GET MY SESSIONS
    ========================= */

    const getMyLandmarkChallengeSessions = useCallback(
        async (page = 1, limit = 10): Promise<void> => {
            setLoadingMySessions(true);

            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                const res = await fetch(
                    `${API_URL}/sessions/me?${params.toString()}`,
                    {
                        method: "GET",
                        headers: authHeaders(token),
                    }
                );

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: PaginatedApiResponse<LandmarkChallengeSession> =
                    await res.json();

                setMySessions(data.data);
                setSessionPagination(data.pagination);
            } catch (error) {
                console.error(
                    "Error getting landmark challenge sessions:",
                    error
                );
            } finally {
                setLoadingMySessions(false);
            }
        },
        [token]
    );

    /* =========================
       GET ONE SESSION
    ========================= */

    const getLandmarkChallengeSession = useCallback(
        async (
            sessionId: string
        ): Promise<LandmarkChallengeSession | null> => {
            setLoadingSession(true);

            try {
                const res = await fetch(
                    `${API_URL}/sessions/${sessionId}`,
                    {
                        method: "GET",
                        headers: authHeaders(token),
                    }
                );

                if (!res.ok) {
                    throw new Error(await getErrorMessage(res));
                }

                const data: ApiResponse<LandmarkChallengeSession> =
                    await res.json();

                setCurrentSession(data.data);

                return data.data;
            } catch (error) {
                console.error(
                    "Error getting landmark challenge session:",
                    error
                );

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
        <LandmarkChallengeContext.Provider
            value={{
                challenges,
                currentChallenge,
                pagination,
                loadingChallenges,
                loadingChallenge,
                getLandmarkChallenges,
                getLandmarkChallenge,

                currentSession,
                sessionChallenges,
                currentHint,
                lastAnswerResult,
                loadingStartGame,
                loadingHint,
                loadingAnswer,
                loadingSubmitGame,
                loadingAbandonGame,
                startLandmarkChallengeGame,
                revealLandmarkHint,
                submitLandmarkAnswer,
                submitLandmarkChallengeGame,
                abandonLandmarkChallengeGame,

                mySessions,
                sessionPagination,
                loadingMySessions,
                loadingSession,
                getMyLandmarkChallengeSessions,
                getLandmarkChallengeSession,

                clearCurrentGame,
                clearLastAnswerResult,
            }}
        >
            {children}
        </LandmarkChallengeContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useLandmarkChallengeContext = () => {
    const context = useContext(LandmarkChallengeContext);

    if (!context) {
        throw new Error(
            "Please use useLandmarkChallengeContext inside LandmarkChallengeProvider"
        );
    }

    return context;
};