import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Hourglass, Scroll } from "lucide-react";
import type { QuizListItem } from "../../Types/QuizPlayTypes";

import { DifficultyBadge } from "./QuizUI";
import { getEraNames } from "../../Types/QuizHelpers";

const QuizCard = ({ quiz }: { quiz: QuizListItem }) => {

    const eras = getEraNames(quiz.eras);

    return (
        <article
            className="
                w-[300px]
                bg-gray-50
                rounded-lg
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                transition-all
                duration-300
                flex
                flex-col
                items-center
                gap-3
                p-4
                border-t-4
                border-[#3E3025]
            "
        >
            <DifficultyBadge difficulty={quiz.difficulty} />

            <h4 className="text-[1.2em] font-bold text-center leading-5.5 text-[#3E3025]">
                {quiz.title}
            </h4>

            <p className="text-sm text-gray-700 text-center line-clamp-3">
                {quiz.description}
            </p>

            <div className="flex items-center justify-center gap-4 text-[13px] font-medium text-gray-600">
                <span className="flex items-center gap-1.5">
                    <Scroll size={15} />
                    {quiz.questionCount} questions
                </span>
                <span className="flex items-center gap-1.5">
                    <Hourglass size={15} />
                    {quiz.timeLimit ? `${quiz.timeLimit} min` : "Untimed"}
                </span>
            </div>

            {eras.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {eras.map((name) => (
                        <span
                            key={name}
                            className="px-2.5 py-1 rounded-full bg-[#F0E6D8] text-[#3E3025] text-[12px] font-medium"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            )}

            <Link
                to={`/quiz/${quiz._id}`}
                className="
                    flex items-center justify-center gap-2 w-full mt-2
                    bg-[#3E3025] text-white p-2 font-semibold rounded-[5px]
                    transition-all duration-200 hover:opacity-90 active:scale-[0.98]
                "
            >
                Take the trial
                <ArrowRight size={17} />
            </Link>
        </article>
    );
};

export default memo(QuizCard);
