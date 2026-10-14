import { memo } from "react";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import type {
    FigureChallengeAnswerResult,
    SafeFigureChallenge,
} from "../../../Contexts/GamesContexts/FigureChallengeContext";

interface Props {
    result: FigureChallengeAnswerResult;
    challenge: SafeFigureChallenge;
    isLast: boolean;
    loading: boolean;
    onNext: () => void;
}

const FigureFeedback = ({ result, challenge, isLast, loading, onNext }: Props) => {
    const ok = result.isCorrect;

    return (
        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[#292722]/10 bg-white shadow-lg">
            <div className="grid sm:grid-cols-2">
                <div className="aspect-square bg-[#d9d2c3] sm:aspect-auto">
                    {challenge.image?.url && (
                        <img
                            src={challenge.image.url}
                            alt={result.correctAnswer}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>

                <div className="flex flex-col gap-4 p-6">
                    <div
                        className={`inline-flex items-center gap-2 font-bold ${
                            ok ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {ok ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
                        <span className="text-2xl">
                            {ok ? "Well done!" : "Not quite..."}
                        </span>
                    </div>

                    <div>
                        <p className="text-xs uppercase tracking-widest text-[#292722]/50">
                            It was
                        </p>
                        <p className="text-2xl font-bold text-[#292722]">
                            {result.correctAnswer}
                        </p>
                    </div>

                    {!ok && (
                        <p className="text-sm text-[#292722]/60">
                            Your answer: <em>{result.userAnswer}</em>
                        </p>
                    )}

                    <p className="w-fit rounded-full bg-[#B08D57]/15 px-3 py-1 text-sm font-semibold text-[#8a6a3a]">
                        +{result.pointsEarned} pts · Total {result.score}
                    </p>

                    {result.historicalContext && (
                        <p className="text-sm font-medium text-[#292722]/80">
                            {result.historicalContext}
                        </p>
                    )}
                    {result.explanation && (
                        <p className="text-sm leading-6 text-[#292722]/70">
                            {result.explanation}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={onNext}
                        disabled={loading}
                        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-4 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-60"
                    >
                        {loading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <ArrowRight size={18} />
                        )}
                        {isLast ? "See results" : "Next figure"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(FigureFeedback);