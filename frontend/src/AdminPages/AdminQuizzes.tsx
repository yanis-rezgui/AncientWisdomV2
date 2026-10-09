import { memo } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Components/Pagination/Pagination";
import { useQuizAdminContext } from "../AdminContexts/QuizAdminContext";
import AdminQuizCard from "../AdminComponents/AdminQuizzesComponents/AdminQuizCard";
import QuizAdminFilters from "../AdminComponents/AdminQuizzesComponents/QuizAdminFilters";
import DeleteQuizPop from "../AdminComponents/AdminQuizzesComponents/DeleteQuizPop";

const AdminQuizzes = () => {
    const {
        adminQuizzes, totalQuizzes, page, totalPages, limit, setPage, setLimit,
        loadingQuizzes, showDeletePop,
    } = useQuizAdminContext();

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] pb-10">
            <div className="w-[900px] flex flex-row items-center justify-between mt-10
            max-[950px]:w-[600px] max-[650px]:flex-col max-[650px]:justify-center
            max-[650px]:px-4 max-[650px]:gap-3">
                <h2 className="text-[#3E3025] text-[1.5em] font-[600]">Quizzes</h2>

                <Link
                    to="/admin/addQuiz"
                    className="bg-[#3E3025] text-white text-[14px] font-[600] p-2 rounded-lg cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    + Add Quiz
                </Link>
            </div>

            <p className="text-[#3E3025] mt-5 px-4 text-center">
                Manage the quizzes played on Ancient Wisdom. Add, update, archive and delete.
            </p>

            <QuizAdminFilters />

            <div className="flex flex-row justify-center items-center gap-2 mt-5 font-[600] text-[18px]">
                <p>Total Quizzes :</p>
                <p>{totalQuizzes}</p>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 mt-5">
                {loadingQuizzes ? (
                    <p className="text-[17px] text-gray-900 font-bold mt-10">Loading ...</p>
                ) : adminQuizzes.length === 0 ? (
                    <p className="text-[15px] text-gray-700 mt-10 px-4 text-center">No quiz found.</p>
                ) : (
                    adminQuizzes.map((q) => <AdminQuizCard quiz={q} key={q._id} />)
                )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={totalQuizzes}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
            />

            {showDeletePop && <DeleteQuizPop />}
        </section>
    );
};

export default memo(AdminQuizzes);