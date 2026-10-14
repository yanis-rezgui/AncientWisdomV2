import type { GameDifficulty } from "./Games";

/* =========================
   COMMON
========================= */

export type ChallengeStatus = "draft" | "published" | "archived";

export interface ChallengeImage {
    url: string;
    publicId: string;
}

// Résultat renvoyé par chaque action admin : la page affiche `message` dans un Toast.
export interface AdminActionResult<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
}

/* =========================
   FIGURE CHALLENGE
========================= */

export interface FigureClue {
    text: string;
    points: number;
}

export interface AdminFigureChallenge {
    _id: string;
    title: string;
    slug: string;
    answer: string;
    acceptedAnswers: string[];
    image: ChallengeImage;
    clues: FigureClue[];
    explanation: string;
    historicalContext: string;
    difficulty: GameDifficulty;
    tags: string[];
    status: ChallengeStatus;
    createdAt: string;
    updatedAt: string;
}

export interface FigureChallengeInput {
    title: string;
    answer: string;
    acceptedAnswers?: string[];
    clues: FigureClue[];
    explanation?: string;
    historicalContext?: string;
    difficulty?: GameDifficulty;
    tags?: string[];
    status?: ChallengeStatus;
    // Fichier facultatif ; à la modification, un nouveau fichier remplace l'ancienne image
    image?: File | null;
    // Modification uniquement : retire l'image existante
    removeImage?: boolean;
}

/* =========================
   LANDMARK CHALLENGE
========================= */

export interface AdminLandmarkChallenge {
    _id: string;
    title: string;
    slug: string;
    image: ChallengeImage;
    answer: string;
    options: string[];
    hint: string;
    explanation: string;
    location: string;
    civilization: string;
    difficulty: GameDifficulty;
    tags: string[];
    status: ChallengeStatus;
    createdAt: string;
    updatedAt: string;
}

export interface LandmarkChallengeInput {
    title: string;
    answer: string;
    // Exactement 4 options uniques ; `answer` doit être l'une d'elles
    options: string[];
    hint?: string;
    explanation?: string;
    location?: string;
    civilization?: string;
    difficulty?: GameDifficulty;
    tags?: string[];
    status?: ChallengeStatus;
    // Obligatoire à la création, facultatif à la modification
    image?: File | null;
}

/* =========================
   LOCATION CHALLENGE
========================= */

export interface ChallengeCoordinates {
    latitude: number;
    longitude: number;
}

export interface AdminLocationChallenge {
    _id: string;
    title: string;
    slug: string;
    question: string;
    answer: string;
    coordinates: ChallengeCoordinates;
    mapZoom: number;
    hint: string;
    explanation: string;
    difficulty: GameDifficulty;
    points: number;
    status: ChallengeStatus;
    createdAt: string;
    updatedAt: string;
}

export interface LocationChallengeInput {
    title: string;
    question: string;
    answer: string;
    coordinates: ChallengeCoordinates;
    mapZoom?: number;
    hint?: string;
    explanation?: string;
    difficulty?: GameDifficulty;
    points?: number;
    status?: ChallengeStatus;
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

export interface AdminMemoryCard {
    _id?: string;
    pairId: string;
    contentType: "text" | "image";
    text: string;
    image: ChallengeImage;
}

export interface AdminMemoryChallenge {
    _id: string;
    title: string;
    slug: string;
    pairType: MemoryPairType;
    cards: AdminMemoryCard[];
    explanation: string;
    difficulty: GameDifficulty;
    status: ChallengeStatus;
    createdAt: string;
    updatedAt: string;
}

// Chaque pairId doit apparaître sur exactement 2 cartes (4 à 30 cartes, nombre pair).
export type MemoryCardInput =
    | {
          pairId: string;
          contentType: "text";
          text: string;
      }
    | {
          pairId: string;
          contentType: "image";
          text?: string;
          // Nouvelle image à uploader
          file?: File;
          // Image existante conservée (modification uniquement)
          image?: ChallengeImage;
      };

export interface MemoryChallengeInput {
    title: string;
    pairType: MemoryPairType;
    // À la modification, `cards` remplace toute la liste
    cards: MemoryCardInput[];
    explanation?: string;
    difficulty?: GameDifficulty;
    status?: ChallengeStatus;
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

export interface AdminWordChallenge {
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
    status: ChallengeStatus;
    createdAt: string;
    updatedAt: string;
}

export interface WordChallengeInput {
    title: string;
    answer: string;
    // Généré automatiquement par le serveur s'il est absent
    scrambledLetters?: string;
    hint?: string;
    explanation?: string;
    category?: WordCategory;
    difficulty?: GameDifficulty;
    points?: number;
    status?: ChallengeStatus;
    // Modification uniquement : génère un nouveau mélange
    regenerateScramble?: boolean;
}
