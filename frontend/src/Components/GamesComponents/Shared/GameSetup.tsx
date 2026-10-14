import { memo, useState } from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import type { Game, GameDifficulty } from "../../../Types/Games";
import type { LucideIcon } from "lucide-react";

interface Props {
    game: Game;
    loading: boolean;
    error: string | null;
    icon?: LucideIcon;
    description?: string;
    onStart: (options: {
        difficulty: GameDifficulty | "";
        questionCount: number;
    }) => void;
    counts?: number[];
    countLabel?: string;
}

const difficulties: { label: string; value: GameDifficulty | "" }[] = [
    { label: "Any", value: "" },
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
];

const defaultCounts = [5, 10, 15];

const pill = (active: boolean) =>
    `rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
        active
            ? "border-[#292722] bg-[#292722] text-[#E8E2D6]"
            : "border-[#292722]/20 bg-white text-[#292722] hover:border-[#B08D57]"
    }`;

const GameSetup = ({
    game,
    loading,
    error,
    onStart,
    icon: Icon = Lightbulb,
    description = "Identify the historical figure with as few clues as possible. The fewer clues you use, the more points you earn.",
    counts = defaultCounts,
    countLabel = "Number of questions",
}: Props) => {
    
    const [difficulty, setDifficulty] = useState<GameDifficulty | "">("");
    const [questionCount, setQuestionCount] = useState(counts[0]);

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-[#292722]/10 bg-white p-8 text-center shadow-lg max-[600px]:p-5">
            <span className="rounded-full bg-[#E8E2D6] p-4 text-[#292722]">
                <Icon size={28} />
            </span>

            <div>
                <h1 className="text-3xl font-bold text-[#292722]">
                    {game.title}
                </h1>
                <p className="mt-2 text-sm text-[#292722]/70">
                    {description}
                </p>
            </div>

            <div className="w-full">
                <p className="mb-3 text-sm font-semibold text-[#292722]">
                    Difficulty
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {difficulties.map((d) => (
                        <button
                            key={d.label}
                            type="button"
                            onClick={() => setDifficulty(d.value)}
                            className={pill(difficulty === d.value)}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full">
                <p className="mb-3 text-sm font-semibold text-[#292722]">
                    {countLabel}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {counts.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setQuestionCount(c)}
                            className={pill(questionCount === c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <button
                type="button"
                disabled={loading}
                onClick={() => onStart({ difficulty, questionCount })}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-4 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-60"
            >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Preparing..." : "Start the challenge"}
            </button>
        </div>
    );
};

export default memo(GameSetup);