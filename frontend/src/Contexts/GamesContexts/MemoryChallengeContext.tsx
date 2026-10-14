import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type {
    GameDifficulty,
    MemoryCardContentType,
    MemoryChallenge,
    MemoryPairType,
} from "../../Types/Games";
import { useAuthContext } from "../AuthContext";
import type { Pagination } from "../../Types/Types";

/* =========================
   API RESPONSE TYPES
========================= */

// Ce que l'API publique renvoie pour la liste / le détail :
// le controller retire les cartes (le pairId révélerait les paires) et l'explication.
export type PublicMemoryChallenge = Omit<
    MemoryChallenge,
    "cards" | "explanation"
>;

// Une carte révélée. Le pairId n'est présent que si la paire a été trouvée.
export interface SafeMemoryCard {
    contentType: MemoryCardContentType;
    text: string;
    image: { url: string } | null;
    pairId?: string;
}

export interface RevealedMemoryCard {
    position: number;
    card: SafeMemoryCard;
}

// État du plateau (utile à la reprise de session).
export interface MemoryBoardState {
    matched: RevealedMemoryCard[];
    flipped: RevealedMemoryCard | null;
    moves: number;
    mismatches: number;
    completed: boolean;
}

// Plateau envoyé au joueur : uniquement le nombre de cartes, jamais leur contenu.
export interface SafeMemoryChallenge {
    _id: string;
    title: string;
    pairType: MemoryPairType;
    difficulty: GameDifficulty;
    cardCount: number;
    board: MemoryBoardState;
}

export interface MemoryChallengeSessionAnswer {
    challenge: string;
    challengeType: "MemoryChallenge";
    userAnswer?: string;
    correctAnswer?: string;
    completed: boolean;
    moves: number;
    mismatches: number;
    matchedPairs: number;
    isCorrect: boolean;
    pointsEarned: number;
    hintsUsed: number;
    timeSpent: number;
    answeredAt?: string;
}

export interface MemoryChallengeSession {
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
    answers: MemoryChallengeSessionAnswer[];
}

type MemoryChallengePagination = Pagination;

export interface MemoryChallengeListFilters {
    page?: number;
    limit?: number;
    difficulty?: GameDifficulty | "";
    pairType?: MemoryPairType | "";
}

// questionCount = nombre de plateaux à jouer.
export interface StartMemoryChallengeOptions {
    gameId: string;
    difficulty?: GameDifficulty | "";
    pairType?: MemoryPairType | "";
    questionCount?: number;
}

export interface MemoryFlipResult {
    challengeId: string;
    // "first" = première carte retournée, "second" = la paire est validée
    phase: "first" | "second";
    flipped: RevealedMemoryCard[];
    isMatch: boolean | null;
    matchedPositions: number[];
    moves: number;
    mismatches: number;
    completed: boolean;
    pointsEarned?: number;
    score: number;
    maxScore: number;
    // Présents uniquement quand le plateau est terminé
    correctAnswer?: string;
    explanation?: string;
}

export interface MemoryChallengeStartResult {
    session: MemoryChallengeSession;
    challenges: SafeMemoryChallenge[];
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    error?: string;
    data: T;
}

interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
    pagination: MemoryChallengePagination;
}

/* =========================
   CONTEXT TYPE
========================= */

interface MemoryChallengeContextType {
    // Challenge browsing
    challenges: PublicMemoryChallenge[];
    currentChallenge: PublicMemoryChallenge | null;
    pagination: MemoryChallengePagination | null;
    loadingChallenges: boolean;
    loadingChallenge: boolean;

    getMemoryChallenges: (filters?: MemoryChallengeListFilters) => Promise<void>;
    getMemoryChallenge: (id: string) => Promise<void>;

    // Gameplay
    currentSession: MemoryChallengeSession | null;
    sessionChallenges: SafeMemoryChallenge[];
    lastFlipResult: MemoryFlipResult | null;

    loadingStartGame: boolean;
    loadingFlip: boolean;
    loadingSubmitGame: boolean;
    loadingAbandonGame: boolean;

    startMemoryChallengeGame: (
        options: StartMemoryChallengeOptions
    ) => Promise<MemoryChallengeStartResult | null>;

    flipMemoryCard: (
        sessionId: string,
        challengeId: string,
        position: number
    ) => Promise<MemoryFlipResult | null>;

    submitMemoryChallengeGame: (sessionId: string) => Promise<void>;
    abandonMemoryChallengeGame: (sessionId: string) => Promise<void>;

    // Session history
    mySessions: MemoryChallengeSession[];
    sessionPagination: MemoryChallengePagination | null;
    loadingMySessions: boolean;
    loadingSession: boolean;

    getMyMemoryChallengeSessions: (page?: number, limit?: number) => Promise<void>;
    getMemoryChallengeSession: (
        sessionId: string
    ) => Promise<MemoryChallengeSession | null>;

    // Utilities
    clearCurrentGame: () => void;
    clearLastFlipResult: () => void;
}

/* =========================
   CONSTANTS & HELPERS
========================= */

const MemoryChallengeContext =
    createContext<MemoryChallengeContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/history-memory`;

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

export const MemoryChallengeProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { token } = useAuthContext();

    /* ----- Challenges ----- */

    const [challenges, setChallenges] = useState<PublicMemoryChallenge[]>([]);
    const [currentChallenge, setCurrentChallenge] =
        useState<PublicMemoryChallenge | null>(null);
    const [pagination, setPagination] =
        useState<MemoryChallengePagination | null>(null);
    const [loadingChallenges, setLoadingChallenges] = useState(false);
    const [loadingChallenge, setLoadingChallenge] = useState(false);

    /* ----- Gameplay ----- */

    const [currentSession, setCurrentSession] =
        useState<MemoryChallengeSession | null>(null);
    const [sessionChallenges, setSessionChallenges] = useState<
        SafeMemoryChallenge[]
    >([]);
    const [lastFlipResult, setLastFlipResult] =
        useState<MemoryFlipResult | null>(null);

    const [loadingStartGame, setLoadingStartGame] = useState(false);
    const [loadingFlip, setLoadingFlip] = useState(false);
    const [loadingSubmitGame, setLoadingSubmitGame] = useState(false);
    const [loadingAbandonGame, setLoadingAbandonGame] = useState(false);

    /* ----- History ----- */

    const [mySessions, setMySessions] = useState<MemoryChallengeSession[]>([]);
    const [sessionPagination, setSessionPagination] =
        useState<MemoryChallengePagination | null>(null);
    const [loadingMySessions, setLoadingMySessions] = useState(false);
    const [loadingSession, setLoadingSession] = useState(false);

    /* =========================
       GET CHALLENGES
    ========================= */

    const getMemoryChallenges = useCallback(
        async (filters: MemoryChallengeListFilters = {}) => {
            setLoadingChallenges(true);

            try {
                const params = new URLSearchParams();

                params.set("page", String(filters.page ?? 1));
                params.set("limit", String(filters.limit ?? 10));

                if (filters.difficulty) {
                    params.set("difficulty", filters.difficulty);
                }
                if (filters.pairType) {
                    params.set("pairType", filters.pairType);
                }

                const res = await fetch(`${API_URL}?${params.toString()}`, {
                    method: "GET",
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: PaginatedApiResponse<PublicMemoryChallenge> =
                    await res.json();

                setChallenges(data.data);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Error getting memory challenges:", error);
            } finally {
                setLoadingChallenges(false);
            }
        },
        []
    );

    /* =========================
       GET ONE CHALLENGE
    ========================= */

    const getMemoryChallenge = useCallback(async (id: string) => {
        setLoadingChallenge(true);

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "GET" });

            if (!res.ok) throw new Error(await getErrorMessage(res));

            const data: ApiResponse<PublicMemoryChallenge> = await res.json();
            setCurrentChallenge(data.data);
        } catch (error) {
            console.error("Error getting memory challenge:", error);
            setCurrentChallenge(null);
        } finally {
            setLoadingChallenge(false);
        }
    }, []);

    /* =========================
       START GAME
    ========================= */

    const startMemoryChallengeGame = useCallback(
        async ({
            gameId,
            difficulty,
            pairType,
            questionCount = 3,
        }: StartMemoryChallengeOptions): Promise<MemoryChallengeStartResult | null> => {
            setLoadingStartGame(true);

            try {
                const res = await fetch(`${API_URL}/start`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({
                        gameId,
                        ...(difficulty ? { difficulty } : {}),
                        ...(pairType ? { pairType } : {}),
                        questionCount,
                    }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<MemoryChallengeStartResult> =
                    await res.json();

                setCurrentSession(data.data.session);
                setSessionChallenges(data.data.challenges);
                setLastFlipResult(null);

                return data.data;
            } catch (error) {
                console.error("Error starting History Memory:", error);
                return null;
            } finally {
                setLoadingStartGame(false);
            }
        },
        [token]
    );

    /* =========================
       FLIP A CARD
    ========================= */

    const flipMemoryCard = useCallback(
        async (
            sessionId: string,
            challengeId: string,
            position: number
        ): Promise<MemoryFlipResult | null> => {
            setLoadingFlip(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/flip`, {
                    method: "POST",
                    headers: authHeaders(token),
                    body: JSON.stringify({ challengeId, position }),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<MemoryFlipResult> = await res.json();
                const result = data.data;

                setLastFlipResult(result);

                setCurrentSession((previous) => {
                    if (!previous) return previous;

                    return {
                        ...previous,
                        score: result.score,
                        maxScore: result.maxScore,
                        correctAnswers:
                            previous.correctAnswers + (result.completed ? 1 : 0),
                        answers: previous.answers.map((item) =>
                            item.challenge === challengeId
                                ? {
                                      ...item,
                                      moves: result.moves,
                                      mismatches: result.mismatches,
                                      matchedPairs: Math.floor(
                                          result.matchedPositions.length / 2
                                      ),
                                      ...(result.completed
                                          ? {
                                                completed: true,
                                                isCorrect: true,
                                                pointsEarned:
                                                    result.pointsEarned ?? 0,
                                                userAnswer: `${result.moves} moves`,
                                                correctAnswer: result.correctAnswer,
                                                answeredAt:
                                                    new Date().toISOString(),
                                            }
                                          : {}),
                                  }
                                : item
                        ),
                    };
                });

                return result;
            } catch (error) {
                console.error("Error flipping memory card:", error);
                return null;
            } finally {
                setLoadingFlip(false);
            }
        },
        [token]
    );

    /* =========================
       SUBMIT / COMPLETE GAME
    ========================= */

    const submitMemoryChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingSubmitGame(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/submit`, {
                    method: "POST",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<MemoryChallengeSession> = await res.json();
                setCurrentSession(data.data);
            } catch (error) {
                console.error("Error completing History Memory:", error);
            } finally {
                setLoadingSubmitGame(false);
            }
        },
        [token]
    );

    /* =========================
       ABANDON GAME
    ========================= */

    const abandonMemoryChallengeGame = useCallback(
        async (sessionId: string): Promise<void> => {
            setLoadingAbandonGame(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}/abandon`, {
                    method: "POST",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<MemoryChallengeSession> = await res.json();
                setCurrentSession(data.data);
            } catch (error) {
                console.error("Error abandoning History Memory:", error);
            } finally {
                setLoadingAbandonGame(false);
            }
        },
        [token]
    );

    /* =========================
       GET MY SESSIONS
    ========================= */

    const getMyMemoryChallengeSessions = useCallback(
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

                const data: PaginatedApiResponse<MemoryChallengeSession> =
                    await res.json();

                setMySessions(data.data);
                setSessionPagination(data.pagination);
            } catch (error) {
                console.error("Error getting memory challenge sessions:", error);
            } finally {
                setLoadingMySessions(false);
            }
        },
        [token]
    );

    /* =========================
       GET ONE SESSION
    ========================= */

    const getMemoryChallengeSession = useCallback(
        async (sessionId: string): Promise<MemoryChallengeSession | null> => {
            setLoadingSession(true);

            try {
                const res = await fetch(`${API_URL}/sessions/${sessionId}`, {
                    method: "GET",
                    headers: authHeaders(token),
                });

                if (!res.ok) throw new Error(await getErrorMessage(res));

                const data: ApiResponse<MemoryChallengeSession> = await res.json();
                setCurrentSession(data.data);

                return data.data;
            } catch (error) {
                console.error("Error getting memory challenge session:", error);
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
        setLastFlipResult(null);
    }, []);

    const clearLastFlipResult = useCallback(() => {
        setLastFlipResult(null);
    }, []);

    return (
        <MemoryChallengeContext.Provider
            value={{
                challenges,
                currentChallenge,
                pagination,
                loadingChallenges,
                loadingChallenge,
                getMemoryChallenges,
                getMemoryChallenge,

                currentSession,
                sessionChallenges,
                lastFlipResult,
                loadingStartGame,
                loadingFlip,
                loadingSubmitGame,
                loadingAbandonGame,
                startMemoryChallengeGame,
                flipMemoryCard,
                submitMemoryChallengeGame,
                abandonMemoryChallengeGame,

                mySessions,
                sessionPagination,
                loadingMySessions,
                loadingSession,
                getMyMemoryChallengeSessions,
                getMemoryChallengeSession,

                clearCurrentGame,
                clearLastFlipResult,
            }}
        >
            {children}
        </MemoryChallengeContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useMemoryChallengeContext = () => {
    const context = useContext(MemoryChallengeContext);

    if (!context) {
        throw new Error(
            "Please use useMemoryChallengeContext inside MemoryChallengeProvider"
        );
    }

    return context;
};