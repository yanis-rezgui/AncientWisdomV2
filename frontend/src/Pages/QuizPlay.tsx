import { memo, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Feather } from "lucide-react";
import { useQuizContext } from "../Contexts/QuizContext";
import QuestionCard from "../Components/QuizComponents/QuestionCard";
import QuestionNavigator from "../Components/QuizComponents/QuestionNavigator";
import QuizTimer from "../Components/QuizComponents/QuizTimer";
import {
    BackButton,
    ConfirmDialog,
    ErrorBanner,
    ScrollLoader,
} from "../Components/QuizComponents/QuizUI";
import { getRefId, isAnswered } from "../Types/QuizHelpers";

const QuizPlay = () => {

    const { attemptId } = useParams<{ attemptId: string }>();
    const navigate = useNavigate();

    const {
        attempt, currentQuiz, submitting,
        getAttempt, getQuiz, saveAnswer, submitQuiz, abandonQuiz,
        quizError, clearQuizError,
    } = useQuizContext();

    const [index, setIndex] = useState(0);
    const [confirm, setConfirm] = useState<"submit" | "abandon" | null>(null);

    // Only use the attempt from the context if it is the one in the URL
    const current = attempt && attempt._id === attemptId ? attempt : null;

    /* ----- time limit (the attempt only holds a quiz id unless it is populated) ----- */

    const quizRef = current?.quiz;
    const quizId = quizRef ? getRefId(quizRef) : null;
    const populatedQuiz = quizRef && typeof quizRef !== "string" ? quizRef : null;

    const timeLimit: number | null | undefined = populatedQuiz
        ? populatedQuiz.timeLimit
        : currentQuiz && currentQuiz._id === quizId
            ? currentQuiz.timeLimit
            : undefined; // still unknown

    /* ----- loading (refresh-safe) ----- */

    useEffect(() => {
        if (attemptId && attempt?._id !== attemptId) getAttempt(attemptId);
        // context functions are recreated on every render, only the id should trigger a fetch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attemptId]);

    useEffect(() => {
        if (quizId && !populatedQuiz && currentQuiz?._id !== quizId) getQuiz(quizId, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizId]);

    /* ----- attempt already finished (time over, submitted elsewhere...) ----- */

    useEffect(() => {
        if (!current || current.status === "in_progress") return;

        navigate(
            current.status === "completed" ? `/quiz-result/${current._id}` : "/quizzes",
            { replace: true }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [current?.status]);

    /* ----- guards ----- */

    if (!current || current.status !== "in_progress") {
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
                    <ScrollLoader />
                )}
            </section>
        );
    }

    /* ----- derived ----- */

    const answers = current.answers;
    const safeIndex = Math.min(index, answers.length - 1);
    const answer = answers[safeIndex];

    const answeredCount = answers.filter(isAnswered).length;
    const unanswered = answers.length - answeredCount;

    /* ----- handlers ----- */

    const handleSelect = async (optionIndex: number) => {
        // On "expired" the context already holds the finalized attempt,
        // the effect above then sends the player to the result.
        await saveAnswer(getRefId(answer.question), optionIndex);
    };

    // Time is over: the server finalizes the attempt, we only need to fetch the outcome.
    const handleExpire = async () => {
        const done = await submitQuiz();
        if (!done && attemptId) await getAttempt(attemptId);
    };

    const handleSubmit = async () => {
        const done = await submitQuiz();
        setConfirm(null);
        if (done) navigate(`/quiz-result/${done._id}`, { replace: true });
    };

    const handleAbandon = async () => {
        const ok = await abandonQuiz();
        setConfirm(null);
        if (ok) navigate("/quizzes", { replace: true });
    };

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative pb-10 px-4">

            <BackButton />

            <div className="w-[800px] max-w-full mt-16 flex flex-col gap-5">

                {/* Title + clock */}
                <div className="flex items-center justify-between gap-4 max-[500px]:flex-col">
                    <h2 className="text-[1.5em] font-bold text-[#3E3025] leading-7 max-[500px]:text-center">
                        {current.quizTitle}
                    </h2>

                    {timeLimit !== undefined && (
                        <QuizTimer
                            startedAt={current.startedAt}
                            timeLimit={timeLimit}
                            onExpire={handleExpire}
                        />
                    )}
                </div>

                {/* Progress */}
                <div>
                    <div className="w-full h-2 bg-[#F0E6D8] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#3E3025] transition-all duration-300"
                            style={{ width: `${(answeredCount / answers.length) * 100}%` }}
                        />
                    </div>
                    <p className="text-[13px] font-medium text-gray-600 mt-1 text-right">
                        {answeredCount} of {answers.length} answered
                    </p>
                </div>

                {quizError && <ErrorBanner message={quizError} onClose={clearQuizError} />}

                <QuestionCard
                    index={safeIndex}
                    total={answers.length}
                    answer={answer}
                    onSelect={handleSelect}
                />

                {/* Previous / next */}
                <div className="flex justify-between gap-3">
                    <button
                        onClick={() => setIndex(safeIndex - 1)}
                        disabled={safeIndex === 0}
                        className="flex items-center gap-1 px-4 py-2 rounded-[5px] border-2 border-[#3E3025] text-[#3E3025] font-semibold
                        cursor-pointer hover:bg-[#F0E6D8] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>

                    <button
                        onClick={() => setIndex(safeIndex + 1)}
                        disabled={safeIndex === answers.length - 1}
                        className="flex items-center gap-1 px-4 py-2 rounded-[5px] border-2 border-[#3E3025] text-[#3E3025] font-semibold
                        cursor-pointer hover:bg-[#F0E6D8] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight size={18} />
                    </button>
                </div>

                <QuestionNavigator answers={answers} current={safeIndex} onGo={setIndex} />

                {/* Finish */}
                <div className="flex flex-col items-center gap-3 mt-4">
                    <button
                        onClick={() => setConfirm("submit")}
                        disabled={submitting}
                        className="flex items-center justify-center gap-2 w-full max-w-[400px] bg-[#8B2E2E] text-white p-3 font-semibold rounded-[5px]
                        cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                    >
                        <Feather size={18} />
                        Seal your answers
                    </button>

                    <button
                        onClick={() => setConfirm("abandon")}
                        disabled={submitting}
                        className="text-sm font-semibold text-[#3E3025]/70 underline cursor-pointer hover:text-[#8B2E2E] disabled:opacity-50"
                    >
                        Abandon this trial
                    </button>
                </div>
            </div>

            {confirm === "submit" && (
                <ConfirmDialog
                    title="Seal your answers?"
                    text={
                        unanswered > 0
                            ? `${unanswered} ${unanswered > 1 ? "questions are" : "question is"} still unanswered and will score nothing. Once sealed, your answers cannot be changed.`
                            : "Once sealed, your answers cannot be changed."
                    }
                    confirmLabel="Seal answers"
                    busy={submitting}
                    onConfirm={handleSubmit}
                    onCancel={() => setConfirm(null)}
                />
            )}

            {confirm === "abandon" && (
                <ConfirmDialog
                    title="Abandon this trial?"
                    text="Your progress will be lost and no score will be awarded."
                    confirmLabel="Abandon"
                    danger
                    busy={submitting}
                    onConfirm={handleAbandon}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </section>
    );
};

export default memo(QuizPlay);