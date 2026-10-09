import { memo, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Feather } from "lucide-react";
import { useQuizContext } from "../Contexts/QuizContext";

import {
    BackButton,
    DifficultyBadge,
    ErrorBanner,
    Ornament,
    ScrollLoader,
} from "../Components/QuizComponents/QuizUI";
import { getEraNames } from "../Types/QuizHelpers";

const QuizDetails = () => {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { currentQuiz, loadingQuiz, getQuiz, startQuiz, loadingAttempt, quizError } = useQuizContext();

    useEffect(() => {
        if (id) getQuiz(id);
        // getQuiz is recreated on every render, only the id should trigger a fetch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Avoid flashing the previous quiz while the new one loads
    const quiz = currentQuiz && currentQuiz._id === id ? currentQuiz : null;

    const handleStart = async () => {
        if (!id) return;

        const attempt = await startQuiz(id);
        if (!attempt) return;

        // A finished attempt (time ran out while away) goes straight to its result
        navigate(
            attempt.status === "completed"
                ? `/quiz-result/${attempt._id}`
                : `/quiz-play/${attempt._id}`
        );
    };

    const totalPoints = quiz ? quiz.questions.reduce((sum, q) => sum + q.points, 0) : 0;

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative pb-10 px-4">

            <BackButton />

            {loadingQuiz && !quiz ? (
                <ScrollLoader />
            ) : !quiz ? (
                <>
                    <ErrorBanner message={quizError ?? "This quiz could not be found."} />
                    <Link to="/quizzes" className="mt-4 font-semibold text-[#3E3025] underline">
                        Back to all trials
                    </Link>
                </>
            ) : (
                <article className="w-[700px] max-w-full mt-16 bg-gray-50 rounded-lg shadow-2xl p-8 border-4 border-double border-[#3E3025]/60 flex flex-col items-center gap-4">

                    <DifficultyBadge difficulty={quiz.difficulty} />

                    <h2 className="text-[2em] font-bold text-center text-[#3E3025] leading-9">
                        {quiz.title}
                    </h2>

                    <Ornament />

                    <p className="text-center text-gray-700">{quiz.description}</p>

                    <dl className="grid grid-cols-3 max-[500px]:grid-cols-1 w-full gap-3 text-center">
                        <div className="bg-[#F0E6D8] rounded-[5px] p-3">
                            <dt className="text-[13px] font-semibold text-gray-600">Questions</dt>
                            <dd className="text-[1.4em] font-bold font-serif text-[#3E3025]">{quiz.questionCount}</dd>
                        </div>
                        <div className="bg-[#F0E6D8] rounded-[5px] p-3">
                            <dt className="text-[13px] font-semibold text-gray-600">Time allowed</dt>
                            <dd className="text-[1.4em] font-bold font-serif text-[#3E3025]">
                                {quiz.timeLimit ? `${quiz.timeLimit} min` : "None"}
                            </dd>
                        </div>
                        <div className="bg-[#F0E6D8] rounded-[5px] p-3">
                            <dt className="text-[13px] font-semibold text-gray-600">Total points</dt>
                            <dd className="text-[1.4em] font-bold font-serif text-[#3E3025]">{totalPoints}</dd>
                        </div>
                    </dl>

                    {quiz.eras.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {getEraNames(quiz.eras).map((name) => (
                                <span key={name} className="px-2.5 py-1 rounded-full bg-[#F0E6D8] text-[#3E3025] text-[12px] font-medium">
                                    {name}
                                </span>
                            ))}
                        </div>
                    )}

                    <ul className="text-sm text-gray-700 list-disc pl-5 flex flex-col gap-1 self-start">
                        <li>Each answer is saved as soon as you choose it.</li>
                        <li>You can leave and come back: an unfinished trial resumes where you stopped.</li>
                        {quiz.timeLimit && (
                            <li>The clock starts now and keeps running if you leave. When it ends, your answers are sealed automatically.</li>
                        )}
                    </ul>

                    {quizError && <ErrorBanner message={quizError} />}

                    <button
                        onClick={handleStart}
                        disabled={loadingAttempt}
                        className="flex items-center justify-center gap-2 w-full mt-2 bg-[#3E3025] text-white p-3 font-semibold rounded-[5px]
                        cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                    >
                        <Feather size={18} />
                        {loadingAttempt ? "Preparing the scroll..." : "Begin the trial"}
                    </button>
                </article>
            )}
        </section>
    );
};

export default memo(QuizDetails);