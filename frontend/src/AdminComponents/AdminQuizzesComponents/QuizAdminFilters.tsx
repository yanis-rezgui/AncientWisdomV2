import { memo, useEffect, useState } from "react";
import { useQuizAdminContext } from "../../AdminContexts/QuizAdminContext";
import type { QuizDifficulty, QuizStatus } from "../../Types/Types";

const fieldClass = `p-2 rounded-[5px] border border-gray-300 bg-white text-[14px] text-gray-900
outline-none transition-colors duration-200 focus:border-[#3E3025]`;

const QuizAdminFilters = () => {
    const { filters, setFilters } = useQuizAdminContext();
    const [search, setSearch] = useState<string>(filters.search);

    // Évite une requête à chaque frappe
    useEffect(() => {
        const t = setTimeout(() => {
            if (search !== filters.search) setFilters({ ...filters, search });
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const hasFilters = filters.search || filters.status || filters.difficulty;

    return (
        <div className="flex flex-row gap-3 mt-5 w-[900px] max-[950px]:w-[600px]
        max-[620px]:w-[320px] max-[620px]:flex-col">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, description or slug"
                className={`${fieldClass} flex-1`}
            />

            <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as QuizStatus | "" })}
                className={`${fieldClass} cursor-pointer`}
            >
                <option value="">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
            </select>

            <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as QuizDifficulty | "" })}
                className={`${fieldClass} cursor-pointer`}
            >
                <option value="">All levels</option>
                <option value="Easy">Apprentice</option>
                <option value="Medium">Scholar</option>
                <option value="Hard">Sage</option>
            </select>

            {hasFilters && (
                <button
                    type="button"
                    onClick={() => { setSearch(""); setFilters({ search: "", status: "", difficulty: "" }); }}
                    className="bg-gray-200 text-[#3E3025] text-[14px] font-[600] p-2 px-3 rounded-[5px] cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    Reset
                </button>
            )}
        </div>
    );
};

export default memo(QuizAdminFilters);