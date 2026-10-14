import { memo, useEffect, useRef, useState } from "react";
import {
    Eye,
    Loader2,
    Lightbulb,
    LogOut,
    Send,
    Timer,
    Trophy,
    User,
} from "lucide-react";
import type { SafeFigureChallenge } from "../../../Contexts/GamesContexts/FigureChallengeContext";

interface Props {
    challenge: SafeFigureChallenge;
    position: number;
    total: number;
    score: number;
    maxScore: number;
    loadingHint: boolean;
    loadingAnswer: boolean;
    onHint: () => void;
    onAnswer: (answer: string, timeSpent: number) => void;
    onQuit: () => void;
}

const FigureQuestion = ({
    challenge,
    position,
    total,
    score,
    maxScore,
    loadingHint,
    loadingAnswer,
    onHint,
    onAnswer,
    onQuit,
}: Props) => {
    const [answer, setAnswer] = useState("");
    const [elapsed, setElapsed] = useState(0);
    const startRef = useRef(Date.now());

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const { clues, cluesRevealed, totalClues } = challenge;
    const currentPoints = clues[clues.length - 1]?.points ?? 0;
    const canHint = cluesRevealed < totalClues;

    // Plus on révèle d'indices, plus l'image devient nette
    const blur =
        totalClues > 1
            ? ((totalClues - cluesRevealed) / (totalClues - 1)) * 18
            : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || loadingAnswer) return;
        onAnswer(answer, Math.floor((Date.now() - startRef.current) / 1000));
    };

    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
            {/* HUD */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#292722]">
                        Figure {position} / {total}
                    </p>

                    <div className="flex items-center gap-3 text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-medium text-[#292722]">
                            <Timer size={15} />
                            {minutes}:{seconds}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#292722] px-3 py-1.5 font-medium text-[#E8E2D6]">
                            <Trophy size={15} />
                            {score} / {maxScore}
                        </span>
                        <button
                            type="button"
                            onClick={onQuit}
                            title="Quit game"
                            className="rounded-full bg-white p-2 text-[#292722]/70 hover:text-red-700"
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-[#292722]/10">
                    <div
                        className="h-full rounded-full bg-[#B08D57] transition-all duration-500"
                        style={{ width: `${((position - 1) / total) * 100}%` }}
                    />
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Portrait */}
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#d9d2c3] shadow-lg">
                    {challenge.image?.url ? (
                        <img
                            src={challenge.image.url}
                            alt="Mystery historical figure"
                            className="h-full w-full object-cover transition-all duration-700"
                            style={{ filter: `blur(${blur}px)`, transform: "scale(1.1)" }}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#292722]/30">
                            <User size={120} />
                        </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                        Who am I?
                    </span>
                    <span className="absolute bottom-4 right-4 rounded-full bg-[#B08D57] px-3 py-1 text-xs font-bold text-white">
                        Worth {currentPoints} pts
                    </span>
                </div>

                {/* Clues + answer */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 rounded-3xl border border-[#292722]/10 bg-white p-5">
                        <div className="flex items-center justify-between">
                            <h2 className="inline-flex items-center gap-2 font-semibold text-[#292722]">
                                <Lightbulb size={18} className="text-[#B08D57]" />
                                Clues
                            </h2>
                            <span className="text-xs text-[#292722]/60">
                                {cluesRevealed} / {totalClues} revealed
                            </span>
                        </div>

                        <ul className="flex flex-col gap-2">
                            {clues.map((clue, i) => (
                                <li
                                    key={i}
                                    className="flex gap-3 rounded-xl bg-[#E8E2D6]/60 p-3 text-sm leading-6 text-[#292722]"
                                >
                                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#292722] text-xs font-bold text-[#E8E2D6]">
                                        {i + 1}
                                    </span>
                                    <span className="flex-1">{clue.text}</span>
                                    <span className="shrink-0 text-xs font-semibold text-[#B08D57]">
                                        {clue.points} pts
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={onHint}
                            disabled={!canHint || loadingHint}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#292722]/20 px-4 py-3 text-sm font-medium text-[#292722] transition-colors hover:border-[#B08D57] hover:text-[#B08D57] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loadingHint ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Eye size={16} />
                            )}
                            {canHint
                                ? "Reveal next clue (fewer points)"
                                : "No more clues"}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type the name of the figure..."
                            autoFocus
                            className="w-full rounded-xl border border-[#292722]/20 bg-white px-4 py-4 text-[#292722] outline-none transition-colors focus:border-[#B08D57]"
                        />
                        <button
                            type="submit"
                            disabled={!answer.trim() || loadingAnswer}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-4 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-50"
                        >
                            {loadingAnswer ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                            Submit answer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default memo(FigureQuestion);