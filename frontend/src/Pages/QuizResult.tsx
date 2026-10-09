import { memo, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { useQuizContext } from "../Contexts/QuizContext";
import type { QuizAttemptAnswer } from "../Types/Types";
import { formatDate, formatDuration, getRefId, getVerdict, isAnswered, toRoman } from "../Types/QuizHelpers";
import { BackButton, ErrorBanner, Ornament, ScrollLoader } from "../Components/QuizComponents/QuizUI";

const GREEK = ["α", "β", "γ", "δ", "ε", "ζ"];

const optionStyle = (i: number, answer: QuizAttemptAnswer) => {
    if (i === answer.correctAnswerIndex) return "bg-[#4F6B3A]/15 border-[#4F6B3A] text-[#3C5229]";
    if (i === answer.selectedAnswerIndex) return "bg-[#8B2E2E]/15 border-[#8B2E2E] text-[#8B2E2E]";
    return "bg-white border-[#3E3025]/20 text-gray-600";
};

const QuizResult = () => {

    const { attemptId } = useParams<{ attemptId: string }>();
    const navigate = useNavigate();
    const { attempt, getAttempt, quizError } = useQuizContext();

    const current = attempt && attempt._id === attemptId ? attempt : null;

    useEffect(() => {
        if (attemptId && attempt?._id !== attemptId) getAttempt(attemptId);
        // context functions are recreated on every render, only the id should trigger a fetch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attemptId]);

    // Still being played: go back to the questions
    useEffect(() => {
        if (current?.status === "in_progress") navigate(`/quiz-play/${current._id}`, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current?.status]);

    if (!current || current.status === "in_progress") {
        return (
            <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative px-4">
                <BackButton />
                {quizError && !current ? (
                    <>
                        <ErrorBanner message={quizError} />
                        <Link to="/quizzes" className="mt-4 font-semibold text-[#3E3025] underline">
                            Back to all trials
                        </Link>
                    </>
                ) : (
                    <ScrollLoader text="Reading the verdict..." />
                )}
            </section>
        );
    }

    const verdict = getVerdict(current.percentage);
    const abandoned = current.status === "abandoned";
    const correctCount = current.answers.filter((a) => a.isCorrect).length;

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative pb-10 px-4">

            <BackButton />

            {/* Verdict */}
            <div className="w-[800px] max-w-full mt-16 bg-gray-50 rounded-lg shadow-2xl p-8 border-4 border-double border-[#3E3025]/60 flex flex-col items-center gap-3 text-center">

                <h2 className="text-[1.2em] font-bold text-[#3E3025]/80">{current.quizTitle}</h2>

                {abandoned ? (
                    <p className="font-semibold text-[#8B2E2E]">This trial was abandoned. No score was awarded.</p>
                ) : (
                    <>
                        <div
                            className="w-[140px] h-[140px] rounded-full bg-[#8B2E2E] text-[#F0E6D8] flex flex-col items-center justify-center
                            border-4 border-double border-[#F0E6D8]/70 shadow-lg"
                            aria-label={`Score: ${Math.round(current.percentage)} percent`}
                        >
                            <span className="text-[2.2em] font-bold font-serif leading-none">
                                {Math.round(current.percentage)}%
                            </span>
                            <span className="text-[13px] mt-1">{current.score} / {current.maxScore}</span>
                        </div>

                        <h3 className="text-[1.8em] font-bold font-serif text-[#3E3025] leading-8 mt-2">
                            {verdict.title}
                        </h3>
                        <p className="text-gray-700">{verdict.text}</p>
                    </>
                )}

                <Ornament />

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-medium text-gray-600">
                    <span>{correctCount} of {current.answers.length} correct</span>
                    <span>Time taken: {formatDuration(current.durationSeconds)}</span>
                    {current.completedAt && <span>{formatDate(current.completedAt)}</span>}
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <Link
                        to={`/quiz/${getRefId(current.quiz)}`}
                        className="bg-[#3E3025] text-white px-4 py-2 font-semibold rounded-[5px] transition-opacity duration-200 hover:opacity-90"
                    >
                        Try again
                    </Link>
                    <Link
                        to="/quizzes"
                        className="px-4 py-2 rounded-[5px] border-2 border-[#3E3025] text-[#3E3025] font-semibold hover:bg-[#F0E6D8]"
                    >
                        All trials
                    </Link>
                    <Link
                        to="/quiz-history"
                        className="px-4 py-2 rounded-[5px] border-2 border-[#3E3025] text-[#3E3025] font-semibold hover:bg-[#F0E6D8]"
                    >
                        My records
                    </Link>
                </div>
            </div>

            {/* Review */}
            {!abandoned && (
                <div className="w-[800px] max-w-full mt-10 flex flex-col gap-5">

                    <h3 className="text-[1.5em] font-bold text-[#3E3025] text-center">Review of your answers</h3>

                    {current.answers.map((answer, i) => {

                        const answered = isAnswered(answer);
                        const status = !answered ? "Unanswered" : answer.isCorrect ? "Correct" : "Incorrect";
                        const statusStyle = !answered
                            ? "bg-gray-200 text-gray-700 border-gray-400"
                            : answer.isCorrect
                                ? "bg-[#4F6B3A]/15 text-[#3C5229] border-[#4F6B3A]/40"
                                : "bg-[#8B2E2E]/15 text-[#8B2E2E] border-[#8B2E2E]/40";

                        return (
                            <article key={i} className="bg-gray-50 rounded-lg shadow-lg p-5 border-2 border-[#3E3025]/20 flex flex-col gap-4">

                                <div className="flex items-center justify-between gap-3">
                                    <span className="font-serif font-bold text-[1.1em] text-[#A67C2D]">
                                        Question {toRoman(i + 1)}
                                    </span>
                                    <div className="flex items-center gap-3 text-[13px] font-semibold">
                                        <span className={`px-2.5 py-1 rounded-full border ${statusStyle}`}>{status}</span>
                                        <span className="text-gray-600">{answer.earnedPoints} / {answer.points}</span>
                                    </div>
                                </div>

                                <h4 className="text-[1.15em] font-bold text-[#3E3025] leading-6">{answer.questionText}</h4>

                                <div className="flex flex-col gap-2">
                                    {answer.options.map((option, optionIndex) => {

                                        const isCorrect = optionIndex === answer.correctAnswerIndex;
                                        const isPicked = optionIndex === answer.selectedAnswerIndex;

                                        return (
                                            <div
                                                key={optionIndex}
                                                className={`flex items-center gap-3 p-3 rounded-[5px] border-2 ${optionStyle(optionIndex, answer)}`}
                                            >
                                                <span className="shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center font-serif font-bold text-sm">
                                                    {GREEK[optionIndex] ?? optionIndex + 1}
                                                </span>

                                                <span className="flex-1 font-medium">{option}</span>

                                                {isCorrect && (
                                                    <span className="flex items-center gap-1 text-[12px] font-semibold">
                                                        <Check size={15} /> Correct answer
                                                    </span>
                                                )}
                                                {isPicked && !isCorrect && (
                                                    <span className="flex items-center gap-1 text-[12px] font-semibold">
                                                        <X size={15} /> Your answer
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default memo(QuizResult);