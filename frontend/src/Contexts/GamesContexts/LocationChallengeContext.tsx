import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { GameDifficulty, LocationChallenge } from "../../Types/Games";
import { useAuthContext } from "../AuthContext";
import type { Pagination } from "../../Types/Types";

/* =========================
   API RESPONSE TYPES
========================= */

// Ce que l'API publique renvoie pour la liste / le détail :
// le controller retire coordinates, answer, hint, explanation, title et slug.
export type PublicLocationChallenge = Omit<
    LocationChallenge,
    "answer" | "coordinates" | "hint" | "explanation" | "title" | "slug"
>;

export interface LocationPoint {
    latitude: number;
    longitude: number;
}

// Ne contient rien qui puisse trahir la réponse (aligné sur getSafeChallenge du controller).
export interface SafeLocationChallenge {
    _id: string;
    question: string;
    mapZoom: number;
    difficulty: GameDifficulty;
    points: number;
    hasHint: boolean;
    hint: string | null;
}

export interface LocationChallengeSessionAnswer {
    challenge: string;
    challengeType: "LocationChallenge";
    answered: boolean;
    userAnswer?: string;
    guess: LocationPoint | null;
    correctLocation: LocationPoint | null;
    distanceKm: number | null;
    isCorrect: boolean;
    pointsEarned: number;
    hintsUsed: number;
    timeSpent: number;
    answeredAt?: string;
    correctAnswer?: string;
}

export interface LocationChallengeSession {
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
    answers: LocationChallengeSessionAnswer[];
}

type LocationChallengePagination = Pagination;

// Le controller n'accepte que difficulty (la recherche textuelle permettrait de deviner le lieu).
export interface LocationChallengeListFilters {
    page?: number;
    limit?: number;
    difficulty?: GameDifficulty | "";
}

export interface StartLocationChallengeOptions {
    gameId: string;
    difficulty?: GameDifficulty | "";
    questionCount?: number;
}

export interface LocationAnswerResult {
    challengeId: string;
    userLocation: LocationPoint;
    correctLocation: LocationPoint;
    correctAnswer: string;
    distanceKm: number;
    // Précision en pourcentage (0 à 100)
    accuracy: number;
    isCorrect: boolean;
    pointsEarned: number;
    maxPoints: number;
    hintUsed: boolean;
    score: number;
    maxScore: number;
    explanation?: string;
}

export interface LocationHintResult {
    challengeId: string;
    hint: string;
    hintsUsed: number;
}

export interface LocationChallengeStartResult {
    session: LocationChallengeSession;
    challenges: SafeLocationChallenge[];
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    error?: string;
    data: T;
}

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    pagination: LocationChallengePagination;
}

/* =========================
   CONTEXT TYPE
========================= */

interface LocationChallengeContextType {
    // Challenge browsing
    challenges: PublicLocationChallenge[];
    currentChallenge: PublicLocationChallenge | null;
    pagination: LocationChallengePagination | null;
    loadingChallenges: boolean;
    loadingChallenge: boolean;

    getLocationChallenges: (
        filters?: LocationChallengeListFilters
    ) => Promise<void>;
    getLocationChallenge: (id: string) => Promise<void>;

    // Gameplay
    currentSession: LocationChallengeSession | null;
    sessionChallenges: SafeLocationChallenge[];
    currentHint: LocationHintResult | null;
    lastAnswerResult: LocationAnswerResult | null;

    loadingStartGame: boolean;
    loadingHint: boolean;
    loadingAnswer: boolean;
    loadingSubmitGame: boolean;
    loadingAbandonGame: boolean;

    startLocationChallengeGame: (
        options: StartLocationChallengeOptions
    ) => Promise<LocationChallengeStartResult | null>;

    revealLocationHint: (
        sessionId: string,
        challengeId: string
    ) => Promise<LocationHintResult | null>;

    submitLocationAnswer: (
        sessionId: string,
        challengeId: string,
        latitude: number,
        longitude: number,
        timeSpent?: number
    ) => Promise<LocationAnswerResult | null>;

    submitLocationChallengeGame: (sessionId: string) => Promise<void>;
    abandonLocationChallengeGame: (sessionId: string) => Promise<void>;

    // Session history
    mySessions: LocationChallengeSession[];
    sessionPagination: LocationChallengePagination | null;
    loadingMySessions: boolean;
    loadingSession: boolean;

    getMyLocationChallengeSessions: (
        page?: number,
        limit?: number
    ) => Promise<void>;
    getLocationChallengeSession: (
        sessionId: string
    ) => Promise<LocationChallengeSession | null>;

    // Utilities
    clearCurrentGame: () => void;
    clearLastAnswerResult: () => void;
}

/* =========================
   CONSTANTS & HELPERS
========================= */

const LocationChallengeContext =
    createContext<LocationChallengeContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/where-in-history`;

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

export const LocationChallengeProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { token } = useAuthContext();

    /* ----- Challenges ----- */

    const [challenges, setChallenges] = useState<PublicLocationChallenge[]>([]);
    const [currentChallenge, setCurrentChallenge] =
        useState<PublicLocationChallenge | null>(null);
    const [pagination, setPagination] =
        useState<LocationChallengePagination | null>(null);
    const [loadingChallenges, setLoadingChallenges] = useState(false);
    const [loadingChallenge, setLoadingChallenge] = useState(false);

    /* ----- Gameplay ----- */

    const [currentSession, setCurrentSession] =
        useState<LocationChallengeSession | null>(null);
    const [sessionChallenges, setSessionChallenges] = useState<
        SafeLocationChallenge[]
    >([]);
    const [currentHint, setCurrentHint] = useState<LocationHintResult | null>(
        null
    );
    const [lastAnswerResult, setLastAnswerResult] =
        useState<LocationAnswerResult | null>(null);

    const [loadingStartGame, setLoadingStartGame] = useState(false);
    const [loadingHint, setLoadingHint] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(false);
    const [loadingSubmitGame, setLoadingSubmitGame] = useState(false);
    const [loadingAbandonGame, setLoadingAbandonGame] = useState(false);

    /* ----- History ----- */

    const [mySessions, setMySessions] = useState<LocationChallengeSession[]>(
        []
    );
    const [sessionPagination, setSessionPagination] =
        useState<LocationChallengePagination | null>(null);
    const [loadingMySessions, setLoadingMySessions] = useState(false);
    const [loadingSession, setLoadingSession] = useState(false);

    /* =========================
       GET CHALLENGES
    ========================= */

    const getLocationChallenges = useCallback(
        async (filters: LocationChallengeListFilters = {}) => {
            setLoadingChallenges(true);

            try {
                const params = new URLSearchParams();

                params.set("page", String(filters.page ?? 1));
                params.set("limit", String(filters.limit ?? 10));

                if (filters.difficulty) {
                    params.set("difficulty", filters.difficulty);
                }

                const res = await fetch(`${API_URL}?${params.toString()}`, {
                    method: "GET",
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: PaginatedApiResponse<PublicLocationChallenge> =
                    await res.json();

                setChallenges(data.data);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Error getting location challenges:", error);
            } finally {
                setLoadingChallenges(false);
            }
        },
        []
    );

    /* =========================
       GET ONE CHALLENGE
    ========================= */

    const getLocationChallenge = useCallback(async (id: string) => {
        setLoadingChallenge(true);

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "GET" });

            if (!res.ok) throw new Error(await getErrorMessage(res));

            const data: ApiResponse<PublicLocationChallenge> = await res.json();
            setCurrentChallenge(data.data);
        } catch (error) {
            console.error("Error getting location challenge:", error);
            setCurrentChallenge(null);
        } finally {
            setLoadingChallenge(false);
        }
    }, []);

    /* =========================
       START GAME
    ========================= */

    const startLocationChallengeGame = useCallback(
        async ({
            gameId,
            difficulty,
            questionCount = 5,
        }: StartLocationChallengeOptions): Promise<LocationChallengeStartResult | null> => {
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

                const data: ApiResponse<LocationChallengeStartResult> =
                    await res.json();

                setCurrentSession(data.data.session);
                setSessionChallenges(data.data.challenges);
                setCurrentHint(null);
                setLastAnswerResult(null);

                return data.data;
            } catch (error) {
                console.error("Error starting Where in History:", error);
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

    const revealLocationHint = useCallback(
        async (
            sessionId: string,
            challengeId: string
        ): Promise<LocationHintResult | null> => {
            setLoadingHint(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/hint`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({ challengeId }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<LocationHintResult> = await res.json();

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
                console.error("Error revealing location hint:", error);
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

    const submitLocationAnswer = useCallback(
        async (
            sessionId: string,
            challengeId: string,
            latitude: number,
            longitude: number,
            timeSpent = 0
        ): Promise<LocationAnswerResult | null> => {
            setLoadingAnswer(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/answer`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({
                        challengeId,
                        latitude,
                        longitude,
                        timeSpent,
                    }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<LocationAnswerResult> = await res.json();
                const result = data.data;

                setLastAnswerResult(result);

                setCurrentSession((previous) => {
                    if (!previous) return previous;

                    return {
                        ...previous,
                        score: result.score,
                        maxScore: result.maxScore,
                        correctAnswers:
                            previous.correctAnswers + (result.isCorrect ? 1 : 0),
                        incorrectAnswers:
                            previous.incorrectAnswers + (result.isCorrect ? 0 : 1),
                        answers: previous.answers.map((item) =>
                            item.challenge === challengeId
                                ? {
                                      ...item,
                                      answered: true,
                                      userAnswer: `${result.distanceKm} km away`,
                                      guess: result.userLocation,
                                      correctLocation: result.correctLocation,
                                      distanceKm: result.distanceKm,
                                      correctAnswer: result.correctAnswer,
                                      isCorrect: result.isCorrect,
                                      pointsEarned: result.pointsEarned,
                                      timeSpent,
                                      answeredAt: new Date().toISOString(),
                                  }
                                : item
                        ),
                    };
                });

                return result;
            } catch (error) {
                console.error("Error submitting location answer:", error);
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

    const submitLocationChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingSubmitGame(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/submit`, {
                    method: "POST",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<LocationChallengeSession> =
                    await res.json();
                setCurrentSession(data.data);
            } catch (error) {
                console.error("Error completing Where in History:", error);
            } finally {
                setLoadingSubmitGame(false);
            }
        },
        [token]
    );

    /* =========================
       ABANDON GAME
    ========================= */

    const abandonLocationChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingAbandonGame(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/abandon`, {
                    method: "POST",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<LocationChallengeSession> =
                    await res.json();
                setCurrentSession(data.data);
            } catch (error) {
                console.error("Error abandoning Where in History:", error);
            } finally {
                setLoadingAbandonGame(false);
            }
        },
        [token]
    );

    /* =========================
       GET MY SESSIONS
    ========================= */

    const getMyLocationChallengeSessions = useCallback(
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

                const data: PaginatedApiResponse<LocationChallengeSession> =
                    await res.json();

                setMySessions(data.data);
                setSessionPagination(data.pagination);
            } catch (error) {
                console.error("Error getting location challenge sessions:", error);
            } finally {
                setLoadingMySessions(false);
            }
        },
        [token]
    );

    /* =========================
       GET ONE SESSION
    ========================= */

    const getLocationChallengeSession = useCallback(
        async (sessionId: string): Promise<LocationChallengeSession | null> => {
            setLoadingSession(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
                    method: "GET",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<LocationChallengeSession> =
                    await res.json();
                setCurrentSession(data.data);

                return data.data;
            } catch (error) {
                console.error("Error getting location challenge session:", error);
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
        <LocationChallengeContext.Provider
            value={{
                challenges,
                currentChallenge,
                pagination,
                loadingChallenges,
                loadingChallenge,
                getLocationChallenges,
                getLocationChallenge,

                currentSession,
                sessionChallenges,
                currentHint,
                lastAnswerResult,
                loadingStartGame,
                loadingHint,
                loadingAnswer,
                loadingSubmitGame,
                loadingAbandonGame,
                startLocationChallengeGame,
                revealLocationHint,
                submitLocationAnswer,
                submitLocationChallengeGame,
                abandonLocationChallengeGame,

                mySessions,
                sessionPagination,
                loadingMySessions,
                loadingSession,
                getMyLocationChallengeSessions,
                getLocationChallengeSession,

                clearCurrentGame,
                clearLastAnswerResult,
            }}
        >
            {children}
        </LocationChallengeContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useLocationChallengeContext = () => {
    const context = useContext(LocationChallengeContext);

    if (!context) {
        throw new Error(
            "Please use useLocationChallengeContext inside LocationChallengeProvider"
        );
    }

    return context;
};