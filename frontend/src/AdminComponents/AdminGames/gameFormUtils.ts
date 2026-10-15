import type { GameDifficulty } from "../../Types/Games";
import type { ChallengeStatus } from "../../Types/GamesAdmin";

/* =========================
   CLASSES
========================= */

export const inputClass =
    "w-full rounded-lg border border-[#E7E0D6] bg-white px-3 py-2 text-[14px] text-[#3E3025] outline-none transition-colors focus:border-[#B89B72] disabled:bg-[#F3EFE8]";

export const secondaryButtonClass =
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E7E0D6] px-3 py-1.5 text-[13px] font-medium text-[#3E3025] transition-colors hover:border-[#B89B72] disabled:cursor-not-allowed disabled:opacity-50";

/* =========================
   OPTIONS
========================= */

export const DIFFICULTY_OPTIONS: GameDifficulty[] = ["Easy", "Medium", "Hard"];

export const STATUS_OPTIONS: { value: ChallengeStatus; label: string }[] = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
];

/* =========================
   CSV HELPERS (tags, accepted answers)
========================= */

export const parseCsv = (value: string): string[] =>
    value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

export const joinCsv = (items?: string[]): string => (items ?? []).join(", ");
