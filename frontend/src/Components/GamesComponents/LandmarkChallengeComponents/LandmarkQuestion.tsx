import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    Landmark,
    Lightbulb,
    Loader2,
    LogOut,
    MapPin,
    Send,
    Timer,
    Trophy,
    XCircle,
} from "lucide-react";
import type {
    LandmarkChallengeAnswerResult,
    SafeLandmarkChallenge,
} from "../../../Contexts/GamesContexts/LandmarkChallengeContext";
import { normalizeText, seededShuffle } from "../gameUi";

interface Props {
    challenge: SafeLandmarkChallenge;
    position: number;
    total: number;
    score: number;
    maxScore: number;
    result: LandmarkChallengeAnswerResult | null;
    isLast: boolean;
    loadingHint: boolean;
    loadingAnswer: boolean;
    loadingNext: boolean;
    onHint: () => void;
    onAnswer: (answer: string, timeSpent: number) => void;
    onNext: () => void;
    onQuit: () => void;
}

const letters = ["A", "B", "C", "D"];

const LandmarkQuestion = ({
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
    const [selected, setSelected] = useState<string | null>(null);
    const [elapsed, setElapsed] = useState(0);
    const startRef = useRef(Date.now());

    const answered = result !== null;

    // Le chrono s'arrête dès que la réponse est validée
    useEffect(() => {
        if (answered) return;

        const timer = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }, 1000);

        return () => clearInterval(timer);
    }, [answered]);

    const options = useMemo(
        () => seededShuffle(challenge.options, challenge._id),
        [challenge._id, challenge.options]
    );

    const optionClass = (option: string) => {
        const base =
            "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-4 text-left text-sm font-medium transition-colors";

        if (!result) {
            return `${base} ${
                selected === option
                    ? "border-[#B08D57] bg-[#B08D57]/10 text-[#292722]"
                    : "border-[#292722]/15 bg-white text-[#292722] hover:border-[#B08D57]/60"
            }`;
        }

        if (normalizeText(option) === normalizeText(result.correctAnswer)) {
            return `${base} border-green-600 bg-green-50 text-green-900`;
        }

        if (option === result.userAnswer) {
            return `${base} border-red-500 bg-red-50 text-red-900`;
        }

        return `${base} border-[#292722]/10 bg-white/60 text-[#292722]/40`;
    };

    const handleConfirm = () => {
        if (!selected || loadingAnswer) return;
        onAnswer(selected, Math.floor((Date.now() - startRef.current) / 1000));
    };

    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {/* HUD */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#292722]">
                        Landmark {position} / {total}
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
                        style={{
                            width: `${
                                ((position - (answered ? 0 : 1)) / total) * 100
                            }%`,
                        }}
                    />
                </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#d9d2c3] shadow-lg">
                {challenge.image?.url ? (
                    <img
                        src={challenge.image.url}
                        alt="Mystery landmark"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#292722]/30">
                        <Landmark size={100} />
                    </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                    Name this landmark
                </span>
            </div>

            {/* Hint */}
            {challenge.hint ? (
                <div className="flex gap-3 rounded-xl bg-[#B08D57]/15 p-4 text-sm leading-6 text-[#292722]">
                    <Lightbulb size={18} className="mt-0.5 shrink-0 text-[#B08D57]" />
                    <p>{challenge.hint}</p>
                </div>
            ) : (
                challenge.hasHint &&
                !answered && (
                    <button
                        type="button"
                        onClick={onHint}
                        disabled={loadingHint}
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#292722]/20 px-4 py-3 text-sm font-medium text-[#292722] transition-colors hover:border-[#B08D57] hover:text-[#B08D57] disabled:opacity-50"
                    >
                        {loadingHint ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Eye size={16} />
                        )}
                        Reveal a hint
                    </button>
                )
            )}

            {/* Options */}
            <div className="grid gap-3 sm:grid-cols-2">
                {options.map((option, i) => {
                    const isCorrectOption =
                        answered &&
                        normalizeText(option) ===
                            normalizeText(result.correctAnswer);
                    const isWrongPick =
                        answered && !isCorrectOption && option === result.userAnswer;

                    return (
                        <button
                            key={option}
                            type="button"
                            disabled={answered}
                            onClick={() => setSelected(option)}
                            className={optionClass(option)}
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#292722]/10 text-xs font-bold">
                                {letters[i]}
                            </span>
                            <span className="flex-1">{option}</span>
                            {isCorrectOption && (
                                <CheckCircle2 size={20} className="text-green-600" />
                            )}
                            {isWrongPick && (
                                <XCircle size={20} className="text-red-500" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Confirm / Feedback */}
            {!answered ? (
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!selected || loadingAnswer}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-4 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-50"
                >
                    {loadingAnswer ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <Send size={18} />
                    )}
                    Confirm answer
                </button>
            ) : (
                <div className="flex flex-col gap-4 rounded-3xl border border-[#292722]/10 bg-white p-5">
                    <div
                        className={`inline-flex items-center gap-2 text-xl font-bold ${
                            result.isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {result.isCorrect ? (
                            <CheckCircle2 size={24} />
                        ) : (
                            <XCircle size={24} />
                        )}
                        {result.isCorrect ? "Well done!" : "Not quite..."}
                        <span className="ml-auto rounded-full bg-[#B08D57]/15 px-3 py-1 text-sm font-semibold text-[#8a6a3a]">
                            +{result.pointsEarned} pts
                        </span>
                    </div>

                    <p className="text-[#292722]">
                        It was <strong>{result.correctAnswer}</strong>
                    </p>

                    {(result.location || result.civilization) && (
                        <div className="flex flex-wrap gap-2 text-sm">
                            {result.location && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E2D6] px-3 py-1 text-[#292722]">
                                    <MapPin size={14} />
                                    {result.location}
                                </span>
                            )}
                            {result.civilization && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8E2D6] px-3 py-1 text-[#292722]">
                                    <Landmark size={14} />
                                    {result.civilization}
                                </span>
                            )}
                        </div>
                    )}

                    {result.explanation && (
                        <p className="text-sm leading-6 text-[#292722]/70">
                            {result.explanation}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={onNext}
                        disabled={loadingNext}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-4 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-60"
                    >
                        {loadingNext ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <ArrowRight size={18} />
                        )}
                        {isLast ? "See results" : "Next landmark"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(LandmarkQuestion);