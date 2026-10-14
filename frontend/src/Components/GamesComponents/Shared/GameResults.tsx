import { memo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
interface ResultsSession {
    score: number;
    maxScore: number;
    durationSeconds?: number;
    answers: {
        challenge: string;
        userAnswer?: string;
        correctAnswer?: string;
        isCorrect: boolean;
        pointsEarned: number;
    }[];
}


interface Props {
    session: ResultsSession;
    challenges: { _id: string; image?: { url: string } }[];
    onPlayAgain: () => void;
}

const getVerdict = (percent: number) => {
    if (percent >= 90) return "Legendary historian!";
    if (percent >= 70) return "Impressive knowledge!";
    if (percent >= 40) return "Good start, keep exploring.";
    return "History awaits you — try again!";
};

const formatTime = (s = 0) =>
    `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;

const GameResults = ({ session, challenges, onPlayAgain }: Props) => {
    const correct = session.answers.filter((a) => a.isCorrect).length;
    const percent = session.maxScore
        ? Math.round((session.score / session.maxScore) * 100)
        : 0;

    const stats = [
        { label: "Score", value: `${session.score}/${session.maxScore}` },
        { label: "Correct", value: `${correct}/${session.answers.length}` },
        { label: "Time", value: formatTime(session.durationSeconds) },
    ];

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-[#292722]/10 bg-white p-8 text-center shadow-lg max-[600px]:p-5">
                <span className="rounded-full bg-[#B08D57] p-4 text-white">
                    <Trophy size={30} />
                </span>
                <h1 className="text-3xl font-bold text-[#292722]">
                    {getVerdict(percent)}
                </h1>
                <p className="text-[#292722]/60">{percent}% of the points earned</p>

                <div className="mt-2 flex flex-wrap justify-center gap-3">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="w-[130px] rounded-lg bg-black/60 p-2 text-white"
                        >
                            <p className="text-[22px] font-bold">{s.value}</p>
                            <p className="text-[13px] font-semibold">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex w-full flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={onPlayAgain}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#292722] px-6 py-3 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white max-[600px]:w-full max-[600px]:justify-center"
                    >
                        <RotateCcw size={16} />
                        Play again
                    </button>
                    <Link
                        to="/games"
                        className="inline-flex items-center justify-center rounded-xl border border-[#292722]/20 px-6 py-3 font-medium text-[#292722] hover:border-[#B08D57] max-[600px]:w-full"
                    >
                        Other games
                    </Link>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-[#292722]">Your review</h2>

                {session.answers.map((a, i) => {
                    const c = challenges.find((x) => x._id === a.challenge);
                    return (
                        <div
                            key={a.challenge + i}
                            className="flex items-center gap-4 rounded-2xl border border-[#292722]/10 bg-white p-3"
                        >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#d9d2c3]">
                                {c?.image?.url && (
                                    <img
                                        src={c.image.url}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-[#292722]">
                                    {a.correctAnswer ?? "—"}
                                </p>
                                <p className="truncate text-sm text-[#292722]/60">
                                    {a.userAnswer
                                        ? `You answered: ${a.userAnswer}`
                                        : "Not answered"}
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <span className="text-sm font-semibold text-[#B08D57]">
                                    +{a.pointsEarned}
                                </span>
                                {a.isCorrect ? (
                                    <CheckCircle2 className="text-green-600" size={22} />
                                ) : (
                                    <XCircle className="text-red-600" size={22} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(GameResults);