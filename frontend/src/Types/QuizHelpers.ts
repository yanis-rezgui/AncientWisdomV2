import type {
    HistoricalEra,
    QuizAttemptAnswer,
    QuizDifficulty,
} from "../Types/Types";

export const toRoman = (num: number): string => {
    const map: [number, string][] = [
        [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
        [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
        [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
    ];

    let n = num;
    let result = "";

    for (const [value, symbol] of map) {
        while (n >= value) {
            result += symbol;
            n -= value;
        }
    }

    return result;
};

export const difficultyLabel: Record<QuizDifficulty, string> = {
    Easy: "Apprentice",
    Medium: "Scholar",
    Hard: "Sage",
};

export const difficultyStyle: Record<QuizDifficulty, string> = {
    Easy: "bg-[#4F6B3A]/15 text-[#3C5229] border-[#4F6B3A]/40",
    Medium: "bg-[#A67C2D]/15 text-[#7A5A14] border-[#A67C2D]/40",
    Hard: "bg-[#8B2E2E]/15 text-[#8B2E2E] border-[#8B2E2E]/40",
};

// Works whether the API returned an ObjectId string or a populated document.
export const getRefId = (ref: string | { _id: string }): string =>
    typeof ref === "string" ? ref : ref._id;

export const isAnswered = (answer: QuizAttemptAnswer): boolean =>
    Number.isInteger(answer.selectedAnswerIndex);

export const getEraNames = (eras: (HistoricalEra | string)[]): string[] =>
    eras
        .filter((era): era is HistoricalEra => typeof era !== "string")
        .map((era) => era.name);

export const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m} min ${s.toString().padStart(2, "0")} s` : `${s} s`;
};

export const formatClock = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

export const getVerdict = (percentage: number) => {
    if (percentage >= 90)
        return { title: "Master of the Ages", text: "Few know history as well as you do." };
    if (percentage >= 70)
        return { title: "Learned Scholar", text: "A strong command of the past." };
    if (percentage >= 50)
        return { title: "Diligent Student", text: "A solid foundation. Keep reading." };
    return { title: "Novice of History", text: "Every scholar started here. Try again." };
};