import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Quiz } from "../../Types/Types";
import { useQuizAdminContext } from "../../AdminContexts/QuizAdminContext";

import QuizStatusBadge from "./QuizStatusBadge";
import { difficultyLabel, difficultyStyle, getEraNames } from "../../Types/QuizHelpers";

const AdminQuizCard = ({ quiz }: { quiz: Quiz }) => {
    const navigate = useNavigate();
    const { setShowDeletePop, setQuizDelete, setErrorMsg } = useQuizAdminContext();

    const eraNames = getEraNames(quiz.eras);

    return (
        <div className="flex flex-col w-[900px] bg-[#F8F5EF] rounded-lg gap-2 p-4 shadow-lg
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        max-[950px]:w-[600px] max-[620px]:w-[320px]">

            <div className="flex flex-row flex-wrap items-center gap-2">
                <h3 className="text-[18px] font-[600] text-[#3E3025] break-words">{quiz.title}</h3>
                <QuizStatusBadge status={quiz.status} />
                <span className={`text-[12px] font-[600] px-2 py-[2px] rounded-full border ${difficultyStyle[quiz.difficulty]}`}>
                    {difficultyLabel[quiz.difficulty]}
                </span>
            </div>

            <p className="text-[14px] text-gray-700 line-clamp-2">{quiz.description}</p>

            {eraNames.length > 0 && (
                <div className="flex flex-row flex-wrap gap-1">
                    {eraNames.map((name) => (
                        <span key={name} className="text-[12px] text-[#3E3025] bg-white border border-gray-300 rounded-full px-2 py-[2px]">
                            {name}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex flex-row justify-between items-center gap-3 mt-2 max-[620px]:flex-col max-[620px]:items-start">
                <p className="text-[14px] text-gray-900">
                    {quiz.questions.length} question(s)
                    {" · "}
                    {quiz.timeLimit ? `${quiz.timeLimit} min` : "No time limit"}
                </p>

                <div className="flex flex-row gap-2 max-[620px]:w-full">
                    <button
                        onClick={() => navigate(`/admin/quiz/${quiz._id}`)}
                        className="bg-green-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60 max-[620px]:flex-1"
                    >
                        <i className="fa-solid fa-pen-to-square"></i> Update
                    </button>

                    <button
                        onClick={() => {
                            setErrorMsg("");
                            setQuizDelete(quiz);
                            setShowDeletePop(true);
                        }}
                        className="bg-red-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60 max-[620px]:flex-1"
                    >
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(AdminQuizCard);