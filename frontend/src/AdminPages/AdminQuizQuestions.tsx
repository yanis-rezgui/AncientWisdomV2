import { memo, useEffect, useState } from "react";
import Pagination from "../Components/Pagination/Pagination";
import Toast from "../AdminComponents/AdminErasComponents/Toast";
import { useQuizQuestionsAdminContext } from "../AdminContexts/QuizQuestionsAdminContext";
import AdminQuestionCard from "../AdminComponents/AdminQuizQuestionsComponents/AdminQuestionCard";
import QuestionFormPop from "../AdminComponents/AdminQuizQuestionsComponents/QuestionFormPop";
import DeleteQuestionPop from "../AdminComponents/AdminQuizQuestionsComponents/DeleteQuestionPop";

import type { IQuizQuestion, QuizQuestionDifficulty, QuizQuestionStatus } from "../Types/Types";
import { useEraContext } from "../Contexts/EraContext";

const fieldClass = `p-2 rounded-[5px] border border-gray-300 bg-white text-[14px] text-gray-900
outline-none transition-colors duration-200 focus:border-[#3E3025]`;

const AdminQuizQuestions = () => {
    const {
        questions, totalQuestions, page, totalPages, limit, setPage, setLimit,
        filters, setFilters, loadingQuestions, showDeletePop,
    } = useQuizQuestionsAdminContext();
    const {erasOptions} = useEraContext();

    const [search, setSearch] = useState<string>(filters.search);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [editing, setEditing] = useState<IQuizQuestion | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        const t = setTimeout(() => {
            if (search !== filters.search) setFilters({ ...filters, search });
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const openAdd = () => { setEditing(null); setFormOpen(true); };
    const openEdit = (q: IQuizQuestion) => { setEditing(q); setFormOpen(true); };

    const hasFilters = filters.search || filters.era || filters.difficulty || filters.status;

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] pb-10">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="w-[900px] flex flex-row items-center justify-between mt-10
            max-[950px]:w-[600px] max-[650px]:flex-col max-[650px]:justify-center
            max-[650px]:px-4 max-[650px]:gap-3">
                <h2 className="text-[#3E3025] text-[1.5em] font-[600]">Quiz Questions</h2>

                <button
                    onClick={openAdd}
                    className="bg-[#3E3025] text-white text-[14px] font-[600] p-2 rounded-lg cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    + Add Question
                </button>
            </div>

            <p className="text-[#3E3025] mt-5 px-4 text-center">
                The question bank used by the quizzes. Add, update, archive and delete.
            </p>

            <div className="flex flex-row flex-wrap gap-3 mt-5 w-[900px] max-[950px]:w-[600px]
            max-[620px]:w-[320px] max-[620px]:flex-col">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search a question"
                    className={`${fieldClass} flex-1`}
                />

                <select
                    value={filters.era}
                    onChange={(e) => setFilters({ ...filters, era: e.target.value })}
                    className={`${fieldClass} cursor-pointer`}
                >
                    <option value="">All eras</option>
                    {erasOptions.map((era) => <option key={era._id} value={era._id}>{era.name}</option>)}
                </select>

                <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as QuizQuestionDifficulty | "" })}
                    className={`${fieldClass} cursor-pointer`}
                >
                    <option value="">All levels</option>
                    <option value="Easy">Apprentice</option>
                    <option value="Medium">Scholar</option>
                    <option value="Hard">Sage</option>
                </select>

                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as QuizQuestionStatus | "" })}
                    className={`${fieldClass} cursor-pointer`}
                >
                    <option value="">All statuses</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                </select>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={() => { setSearch(""); setFilters({ search: "", era: "", difficulty: "", status: "" }); }}
                        className="bg-gray-200 text-[#3E3025] text-[14px] font-[600] p-2 px-3 rounded-[5px] cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        Reset
                    </button>
                )}
            </div>

            <div className="flex flex-row justify-center items-center gap-2 mt-5 font-[600] text-[18px]">
                <p>Total Questions :</p>
                <p>{totalQuestions}</p>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 mt-5">
                {loadingQuestions ? (
                    <p className="text-[17px] text-gray-900 font-bold mt-10">Loading ...</p>
                ) : questions.length === 0 ? (
                    <p className="text-[15px] text-gray-700 mt-10 px-4 text-center">No question found.</p>
                ) : (
                    questions.map((q) => <AdminQuestionCard question={q} key={q._id} onEdit={openEdit} />)
                )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={totalQuestions}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
            />

            {formOpen && (
                <QuestionFormPop
                    question={editing}
                    onClose={() => setFormOpen(false)}
                    onSaved={(message) => {
                        setFormOpen(false);
                        setToast({ message, type: "success" });
                    }}
                />
            )}

            {showDeletePop && <DeleteQuestionPop />}
        </section>
    );
};

export default memo(AdminQuizQuestions);