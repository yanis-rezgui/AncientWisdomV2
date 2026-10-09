import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuizContext } from "../Contexts/QuizContext";
import type { QuizAttemptStatus } from "../Types/Types";

import Pagination from "../Components/Pagination/Pagination";
import { BackButton, ErrorBanner, Ornament, ScrollLoader } from "../Components/QuizComponents/QuizUI";
import { formatDate, formatDuration } from "../Types/QuizHelpers";

const statusLabel: Record<QuizAttemptStatus, string> = {
    in_progress: "In progress",
    completed: "Completed",
    abandoned: "Abandoned",
};

const statusStyle: Record<QuizAttemptStatus, string> = {
    in_progress: "bg-[#A67C2D]/15 text-[#7A5A14] border-[#A67C2D]/40",
    completed: "bg-[#4F6B3A]/15 text-[#3C5229] border-[#4F6B3A]/40",
    abandoned: "bg-gray-200 text-gray-700 border-gray-400",
};

const QuizHistory = () => {

    const { myAttempts, loadingMyAttempts, historyTotal, historyTotalPages, getMyAttempts, quizError, clearQuizError } = useQuizContext();

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    useEffect(() => {
        getMyAttempts(page, limit);
    }, [getMyAttempts, page, limit]);

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative pb-10 px-4">

            <BackButton />

            <h2 className="mt-10 text-[2em] font-bold">My Records</h2>

            <p className="text-center mt-3 font-bold">
                Every trial you have begun, with its outcome.
            </p>

            <Ornament />

            {quizError && <ErrorBanner message={quizError} onClose={clearQuizError} />}

            {loadingMyAttempts ? (
                <ScrollLoader text="Opening the archives..." />
            ) : myAttempts.length === 0 && !quizError ? (
                <div className="mt-12 text-center flex flex-col items-center gap-3">
                    <p className="text-[#3E3025]/80 font-semibold">You have not taken any trial yet.</p>
                    <Link
                        to="/quizzes"
                        className="bg-[#3E3025] text-white px-4 py-2 font-semibold rounded-[5px] transition-opacity duration-200 hover:opacity-90"
                    >
                        Browse the trials
                    </Link>
                </div>
            ) : (
                <ul className="w-[800px] max-w-full mt-6 flex flex-col gap-3">
                    {myAttempts.map((a) => (
                        <li
                            key={a._id}
                            className="bg-gray-50 rounded-lg shadow-lg p-4 border-l-4 border-[#3E3025] flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start"
                        >
                            <div className="flex flex-col gap-1">
                                <h4 className="font-bold text-[1.1em] text-[#3E3025] leading-5.5">{a.quizTitle}</h4>
                                <p className="text-[13px] font-medium text-gray-600">
                                    {formatDate(a.startedAt)}
                                    {a.status === "completed" && ` – ${formatDuration(a.durationSeconds)}`}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 max-[600px]:w-full max-[600px]:justify-between">
                                <span className={`px-2.5 py-1 rounded-full border text-[12px] font-semibold ${statusStyle[a.status]}`}>
                                    {statusLabel[a.status]}
                                </span>

                                {a.status === "completed" && (
                                    <span className="font-serif font-bold text-[1.2em] text-[#3E3025]">
                                        {a.score} / {a.maxScore}
                                        <span className="text-[13px] font-medium text-gray-600 ml-1">
                                            ({Math.round(a.percentage)}%)
                                        </span>
                                    </span>
                                )}

                                {a.status === "completed" && (
                                    <Link
                                        to={`/quiz-result/${a._id}`}
                                        className="bg-[#3E3025] text-white px-3 py-1.5 text-sm font-semibold rounded-[5px] transition-opacity duration-200 hover:opacity-90"
                                    >
                                        Review
                                    </Link>
                                )}

                                {a.status === "in_progress" && (
                                    <Link
                                        to={`/quiz-play/${a._id}`}
                                        className="bg-[#8B2E2E] text-white px-3 py-1.5 text-sm font-semibold rounded-[5px] transition-opacity duration-200 hover:opacity-90"
                                    >
                                        Resume
                                    </Link>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Pagination
                page={page}
                totalPages={historyTotalPages}
                totalItems={historyTotal}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
            />
        </section>
    );
};

export default memo(QuizHistory);