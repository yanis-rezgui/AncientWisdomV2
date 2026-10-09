import { memo } from "react";
import { Search } from "lucide-react";
import { useEraContext } from "../../Contexts/EraContext";
import { useQuizContext } from "../../Contexts/QuizContext";
import type { QuizDifficulty } from "../../Types/Types";
import { difficultyLabel } from "../../Types/QuizHelpers";


const fieldClass = "p-2 bg-white border-2 border-[#3E3025] w-full rounded-[5px]";

const QuizFilter = () => {

    const { erasOptions } = useEraContext();
    const { search, setSearch, difficulty, setDifficulty, era, setEra, resetFilters } = useQuizContext();

    const hasFilters = search !== "" || difficulty !== "" || era !== "";

    return (
        <div className="w-[900px] bg-gray-50 rounded-[10px] max-[950px]:w-[600px] max-[620px]:w-[300px] mt-5 p-3 shadow-2xl">

            <div className="text-[#3E3025] text-[1.5em] flex flex-row items-center gap-3">
                <Search size={25} />
                <p className="font-bold">Search & Filter</p>
            </div>

            <div className="flex flex-row gap-5 items-center mt-3 w-full max-[950px]:flex-col">

                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="quiz-era" className="text-[15px] font-[600]">Era</label>
                    <select
                        id="quiz-era"
                        value={era}
                        onChange={(e) => setEra(e.target.value)}
                        className={`${fieldClass} cursor-pointer`}
                    >
                        <option value="">All Eras</option>
                        {erasOptions.map((e) => (
                            <option key={e._id} value={e._id}>{e.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="quiz-difficulty" className="text-[15px] font-[600]">Rank</label>
                    <select
                        id="quiz-difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as QuizDifficulty | "")}
                        className={`${fieldClass} cursor-pointer`}
                    >
                        <option value="">All Ranks</option>
                        {(Object.keys(difficultyLabel) as QuizDifficulty[]).map((key) => (
                            <option key={key} value={key}>{difficultyLabel[key]}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="quiz-search" className="text-[15px] font-[600]">Search</label>
                    <input
                        id="quiz-search"
                        value={search}
                        placeholder="Quiz title..."
                        onChange={(e) => setSearch(e.target.value)}
                        className={fieldClass}
                    />
                </div>
            </div>

            {hasFilters && (
                <button
                    onClick={resetFilters}
                    className="mt-3 text-sm font-semibold text-[#3E3025] underline cursor-pointer hover:opacity-70"
                >
                    Clear filters
                </button>
            )}
        </div>
    );
};

export default memo(QuizFilter);
