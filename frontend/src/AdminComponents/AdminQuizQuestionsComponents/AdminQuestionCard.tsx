import { memo } from "react";
import type { IQuizQuestion } from "../../Types/Types";
import { useQuizQuestionsAdminContext } from "../../AdminContexts/QuizQuestionsAdminContext";

import QuizStatusBadge from "../AdminQuizzesComponents/QuizStatusBadge";
import { difficultyLabel, difficultyStyle } from "../../Types/QuizHelpers";

const AdminQuestionCard = ({ question, onEdit }: { question: IQuizQuestion; onEdit: (q: IQuizQuestion) => void }) => {
    const { setShowDeletePop, setQuestionDelete, setErrorMsg } = useQuizQuestionsAdminContext();

    return (
        <div className="flex flex-col w-[900px] bg-[#F8F5EF] rounded-lg gap-2 p-4 shadow-lg
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        max-[950px]:w-[600px] max-[620px]:w-[320px]">

            <div className="flex flex-row flex-wrap items-center gap-2">
                <QuizStatusBadge status={question.status} />
                <span className={`text-[12px] font-[600] px-2 py-[2px] rounded-full border ${difficultyStyle[question.difficulty]}`}>
                    {difficultyLabel[question.difficulty]}
                </span>
                {question.era && <span className="text-[12px] text-gray-600">{question.era.name}</span>}
            </div>

            <p className="text-[16px] font-[600] text-[#3E3025] break-words">{question.questionText}</p>

            <ul className="flex flex-col gap-1">
                {question.options.map((option, i) => (
                    <li
                        key={i}
                        className={`text-[14px] break-words ${i === question.correctAnswerIndex
                            ? "text-green-900 font-[600]"
                            : "text-gray-700"}`}
                    >
                        {i === question.correctAnswerIndex
                            ? <i className="fa-solid fa-circle-check"></i>
                            : <i className="fa-regular fa-circle"></i>}{" "}
                        {option}
                    </li>
                ))}
            </ul>

            <div className="flex flex-row justify-end gap-2 mt-2 max-[620px]:w-full">
                <button
                    onClick={() => onEdit(question)}
                    className="bg-green-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60 max-[620px]:flex-1"
                >
                    <i className="fa-solid fa-pen-to-square"></i> Update
                </button>

                <button
                    onClick={() => {
                        setErrorMsg("");
                        setQuestionDelete(question);
                        setShowDeletePop(true);
                    }}
                    className="bg-red-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60 max-[620px]:flex-1"
                >
                    <i className="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>
    );
};

export default memo(AdminQuestionCard);