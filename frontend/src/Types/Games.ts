
/* =========================
   GAMES
========================= */

import type { User } from "./Types";

interface Image {
    url: string;
    publicId: string;
}

export type GameDifficulty = "Easy" | "Medium" | "Hard";

export type GameStatus = "draft" | "published" | "archived";

export type GameType =
    | "guess-the-figure"
    | "name-the-landmark"
    | "word-scramble"
    | "history-memory"
    | "where-in-history";

export interface Game {
    _id: string;
    title: string;
    slug: string;
    description: string;
    gameType: GameType;
    instructions: string[];
    image: Image;
    difficulty: GameDifficulty;
    estimatedDuration: number;
    status: GameStatus;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}


/* =========================
   FIGURE CHALLENGE
========================= */

export interface FigureClue {
    _id?: string;
    text: string;
    points: number;
}

export interface FigureChallenge {
    _id: string;
    title: string;
    slug: string;
    answer: string;
    acceptedAnswers: string[];
    image: Image;
    clues: FigureClue[];
    explanation: string;
    historicalContext: string;
    difficulty: GameDifficulty;
    tags: string[];
    status: GameStatus;
    createdAt: string;
    updatedAt: string;
}


/* =========================
   LANDMARK CHALLENGE
========================= */

export interface LandmarkChallenge {
    _id: string;
    title: string;
    slug: string;
    image: Image;
    answer: string;
    options: string[];
    hint: string;
    explanation: string;
    location: string;
    civilization: string;
    difficulty: GameDifficulty;
    tags: string[];
    status: GameStatus;
    createdAt: string;
    updatedAt: string;
}


/* =========================
   LOCATION CHALLENGE
========================= */

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

export interface LocationChallenge {
    _id: string;
    title: string;
    slug: string;
    question: string;
    answer: string;
    coordinates: LocationCoordinates;
    mapZoom: number;
    hint: string;
    explanation: string;
    difficulty: GameDifficulty;
    points: number;
    status: GameStatus;
    createdAt: string;
    updatedAt: string;
}


/* =========================
   MEMORY CHALLENGE
========================= */

export type MemoryPairType =
    | "figure-portrait"
    | "landmark-name"
    | "event-date"
    | "civilization-artifact"
    | "custom";

export type MemoryCardContentType = "text" | "image";

export interface MemoryCard {
    _id?: string;
    pairId: string;
    contentType: MemoryCardContentType;
    text: string;
    image: Image;
}

export interface MemoryChallenge {
    _id: string;
    title: string;
    slug: string;
    pairType: MemoryPairType;
    cards: MemoryCard[];
    explanation: string;
    difficulty: GameDifficulty;
    status: GameStatus;
    createdAt: string;
    updatedAt: string;
}


/* =========================
   WORD CHALLENGE
========================= */

export type WordCategory =
    | "figure"
    | "event"
    | "place"
    | "civilization"
    | "era"
    | "artifact"
    | "other";

export interface WordChallenge {
    _id: string;
    title: string;
    slug: string;
    answer: string;
    scrambledLetters: string;
    hint: string;
    explanation: string;
    category: WordCategory;
    difficulty: GameDifficulty;
    points: number;
    status: GameStatus;
    createdAt: string;
    updatedAt: string;
}


/* =========================
   GAME SESSION
========================= */

export type GameSessionStatus =
    | "in-progress"
    | "completed"
    | "abandoned";

export type SessionChallengeType =
    | "FigureChallenge"
    | "LandmarkChallenge"
    | "LocationChallenge"
    | "MemoryChallenge"
    | "WordChallenge";

export interface GameSessionAnswer {
    _id: string;

    // Challenge ID before populate, challenge document after populate
    challenge:
        | string
        | FigureChallenge
        | LandmarkChallenge
        | LocationChallenge
        | MemoryChallenge
        | WordChallenge;

    challengeType: SessionChallengeType;

    // Mixed fields in Mongoose; answer types depend on the game
    userAnswer: unknown;
    correctAnswer: unknown;

    isCorrect: boolean;
    pointsEarned: number;
    hintsUsed: number;
    timeSpent: number;
    answeredAt: string;
}

export interface GameSession {
    _id: string;

    // IDs before populate, documents after populate
    user: string | User;
    game: string | Game;

    status: GameSessionStatus;
    difficulty: GameDifficulty;

    score: number;
    maxScore: number;
    correctAnswers: number;
    incorrectAnswers: number;
    totalQuestions: number;

    answers: GameSessionAnswer[];

    startedAt: string;
    completedAt: string | null;
    duration: number;

    createdAt: string;
    updatedAt: string;
}


/* =========================
   GAME FILTERS
========================= */

export interface GameFilterType {
    search: string;
    gameType: GameType | "";
    difficulty: GameDifficulty | "";
    status?: GameStatus | "";
}


/* =========================
   FIGURE CHALLENGE FILTERS
========================= */

export interface FigureChallengeFilterType {
    search: string;
    difficulty: GameDifficulty | "";
    status?: GameStatus | "";
    tags?: string[];
}


/* =========================
   LANDMARK CHALLENGE FILTERS
========================= */

export interface LandmarkChallengeFilterType {
    search: string;
    difficulty: GameDifficulty | "";
    status?: GameStatus | "";
}


/* =========================
   LOCATION CHALLENGE FILTERS
========================= */

export interface LocationChallengeFilterType {
    search: string;
    difficulty: GameDifficulty | "";
    status?: GameStatus | "";
}


/* =========================
   MEMORY CHALLENGE FILTERS
========================= */

export interface MemoryChallengeFilterType {
    search: string;
    pairType: MemoryPairType | "";
    difficulty: GameDifficulty | "";
    status?: GameStatus | "";
}


/* =========================
   WORD CHALLENGE FILTERS
========================= */

export interface WordChallengeFilterType {
    search: string;
    category: WordCategory | "";
    difficulty: GameDifficulty | "";
    status?: GameStatus | "";
}
