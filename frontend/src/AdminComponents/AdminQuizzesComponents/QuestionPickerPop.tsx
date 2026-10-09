import { memo, useEffect, useState } from "react";
import { useQuizQuestionsAdminContext } from "../../AdminContexts/QuizQuestionsAdminContext";
import type { IQuizQuestion, QuizQuestionStatus } from "../../Types/Types";
import { difficultyLabel, difficultyStyle } from "../../Types/QuizHelpers";


interface Props {
    alreadyAdded: string[];
    onConfirm: (questions: IQuizQuestion[]) => void;
    onClose: () => void;
}

const fieldClass = `p-2 rounded-[5px] border border-gray-300 bg-white text-[14px] text-gray-900
outline-none transition-colors duration-200 focus:border-[#3E3025]`;

const QuestionPickerPop = ({ alreadyAdded, onConfirm, onClose }: Props) => {
    const {
        questions, loadingQuestions, filters, setFilters,
        page, totalPages, setPage, totalQuestions,
    } = useQuizQuestionsAdminContext();

    const [search, setSearch] = useState<string>(filters.search);
    const [picked, setPicked] = useState<Map<string, IQuizQuestion>>(new Map());

    useEffect(() => {
        const t = setTimeout(() => {
            if (search !== filters.search) setFilters({ ...filters, search });
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    const toggle = (q: IQuizQuestion) => {
        setPicked((prev) => {
            const next = new Map(prev);
            if (next.has(q._id)) next.delete(q._id);
            else next.set(q._id, q);
            return next;
        });
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-[700px] max-w-full max-h-[90vh] bg-[#F8F5EF] rounded-lg shadow-xl p-5 gap-3
                max-[620px]:p-3"
            >
                <div className="flex flex-row justify-between items-center">
                    <h3 className="text-[18px] font-bold text-[#3E3025]">Add questions</h3>
                    <i onClick={onClose} className="fa-solid fa-xmark cursor-pointer text-gray-600 hover:text-gray-900"></i>
                </div>

                <div className="flex flex-row gap-2 max-[620px]:flex-col">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search a question"
                        className={`${fieldClass} flex-1`}
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value as QuizQuestionStatus | "" })}
                        className={`${fieldClass} cursor-pointer`}
                    >
                        <option value="">All statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <p className="text-[13px] text-gray-600">
                    {totalQuestions} question(s) found · {picked.size} selected
                </p>

                <div className="flex flex-col gap-2 overflow-y-auto min-h-[120px]">
                    {loadingQuestions ? (
                        <p className="text-[14px] font-bold text-gray-900 text-center mt-6">Loading ...</p>
                    ) : questions.length === 0 ? (
                        <p className="text-[14px] text-gray-600 text-center mt-6">No question found.</p>
                    ) : (
                        questions.map((q) => {
                            const added = alreadyAdded.includes(q._id);
                            const checked = picked.has(q._id);

                            return (
                                <label
                                    key={q._id}
                                    className={`flex flex-row gap-3 items-start bg-white border rounded-lg p-3
                                    ${added ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                    ${checked ? "border-[#3E3025]" : "border-gray-200"}`}
                                >
                                    <input
                                        type="checkbox"
                                        disabled={added}
                                        checked={checked}
                                        onChange={() => toggle(q)}
                                        className="mt-1 shrink-0"
                                    />
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <p className="text-[14px] text-gray-900 break-words">{q.questionText}</p>
                                        <div className="flex flex-row flex-wrap gap-2 items-center">
                                            <span className={`text-[11px] font-[600] px-2 rounded-full border ${difficultyStyle[q.difficulty]}`}>
                                                {difficultyLabel[q.difficulty]}
                                            </span>
                                            <span className="text-[11px] text-gray-600 capitalize">{q.status}</span>
                                            {q.era && <span className="text-[11px] text-gray-600">{q.era.name}</span>}
                                            {added && <span className="text-[11px] text-green-900 font-[600]">Already in quiz</span>}
                                        </div>
                                    </div>
                                </label>
                            );
                        })
                    )}
                </div>

                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2 text-[13px]">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="bg-gray-200 text-[#3E3025] font-[600] px-3 py-1 rounded-[5px] cursor-pointer
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <span>{page} / {totalPages}</span>
                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="bg-gray-200 text-[#3E3025] font-[600] px-3 py-1 rounded-[5px] cursor-pointer
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                <div className="flex flex-row justify-end gap-2 max-[450px]:flex-col-reverse max-[450px]:items-stretch">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-200 text-[#3E3025] text-[14px] font-[600] p-2 px-4 rounded-[5px] cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={picked.size === 0}
                        onClick={() => onConfirm([...picked.values()])}
                        className="bg-[#3E3025] text-white text-[14px] font-[600] p-2 px-4 rounded-[5px] cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <i className="fa-solid fa-plus"></i> Add {picked.size > 0 ? `(${picked.size})` : ""}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(QuestionPickerPop);