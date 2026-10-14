import { memo, useState } from "react";
import {
    CheckCircle2,
    Lightbulb,
    Loader2,
    LogOut,
    MapPin,
    XCircle,
} from "lucide-react";
import type {
    LocationAnswerResult,
    LocationPoint,
    SafeLocationChallenge,
} from "../../../Contexts/GamesContexts/LocationChallengeContext";
import LocationMap from "./LocationMap";

interface Props {
    challenge: SafeLocationChallenge;
    position: number;
    total: number;
    score: number;
    maxScore: number;
    result: LocationAnswerResult | null;
    isLast: boolean;
    loadingHint: boolean;
    loadingAnswer: boolean;
    loadingNext: boolean;
    onHint: () => void;
    onAnswer: (latitude: number, longitude: number, timeSpent: number) => void;
    onNext: () => void;
    onQuit: () => void;
}

const difficultyStyles: Record<string, string> = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-amber-100 text-amber-800",
    Hard: "bg-red-100 text-red-800",
};

const formatDistance = (km: number) =>
    km < 100
        ? `${km.toLocaleString(undefined, { maximumFractionDigits: 1 })} km`
        : `${Math.round(km).toLocaleString()} km`;

const LocationQuestion = ({
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
    const [guess, setGuess] = useState<LocationPoint | null>(null);
    // Le composant est remonté à chaque question (key={challenge._id}),
    // donc ce timestamp repart de zéro pour chaque lieu.
    const [startedAt] = useState(() => Date.now());

    const answered = Boolean(result);
    const progress = Math.round(((position - 1) / total) * 100);
    const halfPoints = Math.ceil(challenge.points / 2);
    const hintUsed = Boolean(challenge.hint);

    // Une fois répondu, on affiche la position validée par le serveur
    const displayedGuess = result ? result.userLocation : guess;
    const correctLocation = result ? result.correctLocation : null;

    const handleSubmit = () => {
        if (answered || loadingAnswer || !guess) return;

        const timeSpent = Math.round((Date.now() - startedAt) / 1000);
        onAnswer(guess.latitude, guess.longitude, timeSpent);
    };

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#292722]">
                    Location {position} / {total}
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
            <div className="flex flex-col gap-5 rounded-3xl border border-[#292722]/10 bg-white p-8 shadow-lg max-[600px]:p-4">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                difficultyStyles[challenge.difficulty] ?? ""
                            }`}
                        >
                            {challenge.difficulty}
                        </span>
                        <span className="rounded-full bg-[#292722]/5 px-3 py-1 text-xs font-semibold text-[#292722]">
                            {hintUsed ? halfPoints : challenge.points} pts
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-[#292722] max-[600px]:text-xl">
                        {challenge.question}
                    </h2>

                    <p className="text-sm text-[#292722]/60">
                        {answered
                            ? "Here is how close you got."
                            : guess
                              ? "Marker placed — click elsewhere to move it."
                              : "Click on the map to place your marker."}
                    </p>
                </div>

                {/* Map */}
                <LocationMap
                    guess={displayedGuess}
                    correctLocation={correctLocation}
                    disabled={answered || loadingAnswer}
                    onGuess={setGuess}
                />

                {/* Legend (after answer) */}
                {answered && (
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#292722]/70">
                        <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-[#292722]" />
                            Your guess
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-green-600" />
                            Correct location
                        </span>
                    </div>
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
                        className="inline-flex items-center justify-center gap-2 self-center rounded-xl border border-[#292722]/20 px-4 py-2 text-sm font-medium text-[#292722] hover:border-[#B08D57] disabled:opacity-60"
                    >
                        {loadingHint ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Lightbulb size={16} />
                        )}
                        Show hint (half points)
                    </button>
                )}

                {/* Validate */}
                {!answered && (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loadingAnswer || !guess}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-3 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-60"
                    >
                        {loadingAnswer ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <MapPin size={18} />
                        )}
                        {loadingAnswer ? "Checking..." : "Validate my answer"}
                    </button>
                )}

                {/* Result */}
                {result && (
                    <div
                        className={`flex w-full flex-col gap-3 rounded-2xl p-4 text-left ${
                            result.isCorrect
                                ? "bg-green-50 text-green-900"
                                : "bg-red-50 text-red-900"
                        }`}
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 font-semibold">
                                {result.isCorrect ? (
                                    <CheckCircle2 size={20} />
                                ) : (
                                    <XCircle size={20} />
                                )}
                                {result.isCorrect ? "Well located!" : "Too far away..."}
                            </div>
                            <span className="text-sm font-semibold">
                                +{result.pointsEarned} / {result.maxPoints} pts
                            </span>
                        </div>

                        <p className="text-sm">
                            It was <strong>{result.correctAnswer}</strong>. You were{" "}
                            <strong>{formatDistance(result.distanceKm)}</strong> away.
                        </p>

                        {/* Accuracy bar */}
                        <div>
                            <div className="mb-1 flex justify-between text-xs font-medium opacity-80">
                                <span>Accuracy</span>
                                <span>{result.accuracy}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-black/10">
                                <div
                                    className={`h-full rounded-full transition-all ${
                                        result.isCorrect ? "bg-green-600" : "bg-red-500"
                                    }`}
                                    style={{ width: `${result.accuracy}%` }}
                                />
                            </div>
                        </div>

                        {result.hintUsed && (
                            <p className="text-xs opacity-80">
                                Hint used: points were halved.
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
                            {isLast ? "See results" : "Next location"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(LocationQuestion);