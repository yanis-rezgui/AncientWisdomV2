import { Brain, Compass, Lightbulb, MapPinned, Puzzle } from "lucide-react";
import type { GameType } from "../../Types/Games";

export const gameIcons = {
    "guess-the-figure": Lightbulb,
    "name-the-landmark": Compass,
    "word-scramble": Puzzle,
    "history-memory": Brain,
    "where-in-history": MapPinned,
};

export const gameLabels: Record<GameType, string> = {
    "guess-the-figure": "Guess the Figure",
    "name-the-landmark": "Name the Landmark",
    "word-scramble": "Word Scramble",
    "history-memory": "History Memory",
    "where-in-history": "Where in History",
};

export const difficultyStyles: Record<string, string> = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-amber-100 text-amber-800",
    Hard: "bg-red-100 text-red-800",
};

// Jeux dont l'UI est prête — ajoute les autres au fur et à mesure




export const playableGames: GameType[] = [
    "guess-the-figure",
    "name-the-landmark",
      "word-scramble",
      "history-memory",
      "where-in-history",
];

export const normalizeText = (value = "") =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, "");

const hashSeed = (seed: string) => {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
};

// Mélange déterministe : le même seed donne toujours le même ordre.
// Évite que la bonne réponse soit toujours en première position.
export const seededShuffle = <T>(items: T[], seed: string): T[] => {
    let a = hashSeed(seed);
    const rand = () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};