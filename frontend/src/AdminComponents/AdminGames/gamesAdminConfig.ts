import {
    Brain,
    Compass,
    Lightbulb,
    MapPinned,
    Puzzle,
    type LucideIcon,
} from "lucide-react";

import type {
    AdminFigureChallenge,
    AdminLandmarkChallenge,
    AdminLocationChallenge,
    AdminMemoryChallenge,
    AdminWordChallenge,
} from "../../Types/GamesAdmin";

/* =========================
   TYPES
========================= */

export type GameKey = "figure" | "landmark" | "location" | "memory" | "word";

export type AdminChallenge =
    | AdminFigureChallenge
    | AdminLandmarkChallenge
    | AdminLocationChallenge
    | AdminMemoryChallenge
    | AdminWordChallenge;

// Ce que AdminLearnCard affiche pour un défi
export interface ChallengeCardData {
    image?: string;
    title: string;
    subtitle?: string;
    description: string;
    badge?: string;
    footer: string;
}

export interface GameAdminConfig {
    key: GameKey;
    label: string;
    description: string;
    icon: LucideIcon;
    // Segment de route sous /api/v1/admin
    apiPath: string;
    // Nom singulier pour les titres ("Add a figure challenge")
    singular: string;
    toCard: (challenge: AdminChallenge) => ChallengeCardData;
}

/* =========================
   CARD MAPPERS
========================= */

const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

const figureCard = (c: AdminFigureChallenge): ChallengeCardData => ({
    image: c.image?.url || undefined,
    title: c.title,
    subtitle: `Answer: ${c.answer}`,
    description: c.explanation || c.historicalContext,
    badge: capitalize(c.status),
    footer: `${c.difficulty} · ${c.clues.length} clues`,
});

const landmarkCard = (c: AdminLandmarkChallenge): ChallengeCardData => ({
    image: c.image?.url || undefined,
    title: c.title,
    subtitle: `Answer: ${c.answer}`,
    description: [c.location, c.civilization].filter(Boolean).join(" · "),
    badge: capitalize(c.status),
    footer: c.difficulty,
});

const locationCard = (c: AdminLocationChallenge): ChallengeCardData => ({
    title: c.title,
    subtitle: `Answer: ${c.answer}`,
    description: c.question,
    badge: capitalize(c.status),
    footer: `${c.difficulty} · ${c.points} pts`,
});

const memoryCard = (c: AdminMemoryChallenge): ChallengeCardData => ({
    image: c.cards.find((card) => card.image?.url)?.image.url,
    title: c.title,
    subtitle: c.pairType,
    description: c.explanation,
    badge: capitalize(c.status),
    footer: `${c.cards.length / 2} pairs · ${c.difficulty}`,
});

const wordCard = (c: AdminWordChallenge): ChallengeCardData => ({
    title: c.title,
    subtitle: `Answer: ${c.answer}`,
    description: c.hint,
    badge: capitalize(c.status),
    footer: `${capitalize(c.category)} · ${c.difficulty} · ${c.points} pts`,
});

/* =========================
   CONFIGS
========================= */

export const GAME_CONFIGS: GameAdminConfig[] = [
    {
        key: "figure",
        label: "Guess the Figure",
        description:
            "Identify a historical figure from progressive clues.",
        icon: Lightbulb,
        apiPath: "figure-challenges",
        singular: "figure challenge",
        toCard: (c) => figureCard(c as AdminFigureChallenge),
    },
    {
        key: "landmark",
        label: "Name the Landmark",
        description: "Recognize a landmark from its picture among 4 options.",
        icon: Compass,
        apiPath: "landmark-challenges",
        singular: "landmark challenge",
        toCard: (c) => landmarkCard(c as AdminLandmarkChallenge),
    },
    {
        key: "word",
        label: "Word Scramble",
        description: "Unscramble the letters to find the historical word.",
        icon: Puzzle,
        apiPath: "word-challenges",
        singular: "word challenge",
        toCard: (c) => wordCard(c as AdminWordChallenge),
    },
    {
        key: "memory",
        label: "History Memory",
        description: "Match every historical pair of cards.",
        icon: Brain,
        apiPath: "memory-challenges",
        singular: "memory challenge",
        toCard: (c) => memoryCard(c as AdminMemoryChallenge),
    },
    {
        key: "location",
        label: "Where in History",
        description: "Place the answer on the world map.",
        icon: MapPinned,
        apiPath: "location-challenges",
        singular: "location challenge",
        toCard: (c) => locationCard(c as AdminLocationChallenge),
    },
];

export const getGameConfig = (key?: string): GameAdminConfig | undefined =>
    GAME_CONFIGS.find((config) => config.key === key);