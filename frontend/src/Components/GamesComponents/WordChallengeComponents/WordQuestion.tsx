import { memo, useState, type FormEvent } from "react";
import {
    CheckCircle2,
    Lightbulb,
    Loader2,
    LogOut,
    Shuffle,
    XCircle,
} from "lucide-react";
import type { SafeWordChallenge } from "../../../Contexts/GamesContexts/WordChallengeContext";
import type { WordChallengeAnswerResult } from "../../../Contexts/GamesContexts/WordChallengeContext";

interface Props {
    challenge: SafeWordChallenge;
    position: number;
    total: number;
    score: number;
    maxScore: number;
    result: WordChallengeAnswerResult | null;
    isLast: boolean;
    loadingHint: boolean;
    loadingAnswer: boolean;
    loadingNext: boolean;
    onHint: () => void;
    onAnswer: (answer: string, timeSpent: number) => void;
    onNext: () => void;
    onQuit: () => void;
}

// Même table que dans ton fichier de helpers (difficultyStyles) :
// remplace par un import si tu préfères ne pas la dupliquer.
const difficultyStyles: Record<string, string> = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-amber-100 text-amber-800",
    Hard: "bg-red-100 text-red-800",
};

// Une lettre par tuile ; les espaces sont ignorés (ils ne sont pas à placer).
const toLetters = (scrambled: string) =>
    scrambled.split("").filter((char) => char.trim() !== "");

const shuffleArray = <T,>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};

const WordQuestion = ({
    challenge,
    position,
    total,
    score,
    maxScore,
    result,
    isLast,
    loadingHint,
    loadingAnswer,
    loadingNext,
    onHint,
    onAnswer,
    onNext,
    onQuit,
}: Props) => {
    const [answer, setAnswer] = useState("");
    const [letters, setLetters] = useState(() =>
        toLetters(challenge.scrambledLetters)
    );
    // Le composant est remonté à chaque question (key={challenge._id}),
    // donc ce timestamp repart de zéro pour chaque mot.
    const [startedAt] = useState(() => Date.now());

    const answered = Boolean(result);
    const progress = Math.round(((position - 1) / total) * 100);
    const halfPoints = Math.ceil(challenge.points / 2);
    const hintUsed = Boolean(challenge.hint);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        if (answered || loadingAnswer || !answer.trim()) return;

        const timeSpent = Math.round((Date.now() - startedAt) / 1000);
        onAnswer(answer.trim(), timeSpent);
    };

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#292722]">
                    Word {position} / {total}
                </p>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#B08D57] px-3 py-1 text-sm font-semibold text-white">
                        {score} / {maxScore} pts
                    </span>
                    <button
                        type="button"
                        onClick={onQuit}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#292722]/20 px-3 py-1 text-sm text-[#292722] hover:border-red-400 hover:text-red-600"
                    >
                        <LogOut size={14} />
                        Quit
                    </button>
                </div>
            </div>

            {/* Progress */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#292722]/10">
                <div
                    className="h-full rounded-full bg-[#B08D57] transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Card */}
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-[#292722]/10 bg-white p-8 text-center shadow-lg max-[600px]:p-5">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            difficultyStyles[challenge.difficulty] ?? ""
                        }`}
                    >
                        {challenge.difficulty}
                    </span>
                    <span className="rounded-full bg-[#E8E2D6] px-3 py-1 text-xs font-semibold capitalize text-[#292722]">
                        {challenge.category}
                    </span>
                    <span className="rounded-full bg-[#292722]/5 px-3 py-1 text-xs font-semibold text-[#292722]">
                        {hintUsed ? halfPoints : challenge.points} pts
                    </span>
                </div>

                <p className="text-sm text-[#292722]/60">
                    Unscramble the letters to find the word
                </p>

                {/* Letter tiles */}
                <div className="flex flex-wrap justify-center gap-2">
                    {letters.map((letter, i) => (
                        <span
                            key={`${letter}-${i}`}
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#292722] text-xl font-bold uppercase text-[#E8E2D6] shadow max-[600px]:h-10 max-[600px]:w-10 max-[600px]:text-lg"
                        >
                            {letter}
                        </span>
                    ))}
                </div>

                {!answered && (
                    <button
                        type="button"
                        onClick={() => setLetters((prev) => shuffleArray(prev))}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#292722]/70 hover:text-[#B08D57]"
                    >
                        <Shuffle size={15} />
                        Shuffle letters
                    </button>
                )}

                {/* Hint */}
                {challenge.hint && (
                    <div className="flex w-full items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-left text-sm text-amber-900">
                        <Lightbulb size={18} className="mt-0.5 shrink-0" />
                        <p>{challenge.hint}</p>
                    </div>
                )}

                {!answered && challenge.hasHint && !challenge.hint && (
                    <button
                        type="button"
                        disabled={loadingHint}
                        onClick={onHint}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#292722]/20 px-4 py-2 text-sm font-medium text-[#292722] hover:border-[#B08D57] disabled:opacity-60"
                    >
                        {loadingHint ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Lightbulb size={16} />
                        )}
                        Show hint (half points)
                    </button>
                )}

                {/* Answer form */}
                <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        disabled={answered || loadingAnswer}
                        placeholder="Type your answer..."
                        autoComplete="off"
                        autoFocus
                        className="w-full rounded-xl border border-[#292722]/20 px-4 py-3 text-center text-lg text-[#292722] outline-none focus:border-[#B08D57] disabled:bg-[#292722]/5"
                    />

                    {!answered && (
                        <button
                            type="submit"
                            disabled={loadingAnswer || !answer.trim()}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-3 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-60"
                        >
                            {loadingAnswer && (
                                <Loader2 size={18} className="animate-spin" />
                            )}
                            {loadingAnswer ? "Checking..." : "Check answer"}
                        </button>
                    )}
                </form>

                {/* Result */}
                {result && (
                    <div
                        className={`flex w-full flex-col gap-2 rounded-2xl p-4 text-left ${
                            result.isCorrect
                                ? "bg-green-50 text-green-900"
                                : "bg-red-50 text-red-900"
                        }`}
                    >
                        <div className="flex items-center gap-2 font-semibold">
                            {result.isCorrect ? (
                                <CheckCircle2 size={20} />
                            ) : (
                                <XCircle size={20} />
                            )}
                            {result.isCorrect
                                ? `Correct! +${result.pointsEarned} pts`
                                : "Not quite..."}
                        </div>

                        {!result.isCorrect && (
                            <p className="text-sm">
                                The answer was{" "}
                                <strong>{result.correctAnswer}</strong>.
                            </p>
                        )}

                        {result.explanation && (
                            <p className="text-sm opacity-90">{result.explanation}</p>
                        )}

                        <button
                            type="button"
                            disabled={loadingNext}
                            onClick={onNext}
                            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-3 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-60"
                        >
                            {loadingNext && (
                                <Loader2 size={18} className="animate-spin" />
                            )}
                            {isLast ? "See results" : "Next word"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(WordQuestion);