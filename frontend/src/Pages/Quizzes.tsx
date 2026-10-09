import { memo } from "react";
import { Link } from "react-router-dom";
import { useQuizContext } from "../Contexts/QuizContext";
import QuizFilter from "../Components/QuizComponents/QuizFilter";
import QuizCard from "../Components/QuizComponents/QuizCard";
import Pagination from "../Components/Pagination/Pagination";
import { BackButton, Ornament, ScrollLoader } from "../Components/QuizComponents/QuizUI";

const Quizzes = () => {

    const { quizzes, loadingQuizzes, page, setPage, limit, setLimit, totalQuizzes, totalPages } = useQuizContext();

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative pb-10">

            <h2 className="mt-10 text-[2em] font-bold">Trials of Knowledge</h2>

            <p className="text-center mt-3 font-bold px-4">
                Test what you know of the eras, figures and events that shaped history,
                and earn your rank as Apprentice, Scholar or Sage.
            </p>

            <Ornament />

            <QuizFilter />

            {loadingQuizzes ? (
                <ScrollLoader />
            ) : quizzes.length === 0 ? (
                <p className="mt-16 text-[#3E3025]/80 font-semibold text-center px-4">
                    No trial matches your search. Clear the filters to see them all.
                </p>
            ) : (
                <div className="flex flex-wrap justify-center items-start gap-5 mt-10 px-10">
                    {quizzes.map((quiz) => (
                        <QuizCard quiz={quiz} key={quiz._id} />
                    ))}
                </div>
            )}

            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={totalQuizzes}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
            />

            <Link
                to="/quiz-history"
                className="bg-[#3E3025] text-white absolute right-2 top-2 px-4 py-1 rounded-[10px]
                transition-opacity duration-200 hover:opacity-80 active:opacity-60"
            >
                My records
            </Link>

            <BackButton />
        </section>
    );
};

export default memo(Quizzes);