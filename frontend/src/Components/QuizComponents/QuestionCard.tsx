import { memo } from "react";
import type { QuizAttemptAnswer } from "../../Types/Types";
import { toRoman } from "../../Types/QuizHelpers";


const GREEK = ["α", "β", "γ", "δ", "ε", "ζ"];

interface QuestionCardProps {
    index: number;
    total: number;
    answer: QuizAttemptAnswer;
    onSelect: (optionIndex: number) => void;
}

const QuestionCard = ({ index, total, answer, onSelect }: QuestionCardProps) => {
    return (
        <div className="w-full bg-gray-50 rounded-lg shadow-lg p-6 border-2 border-[#3E3025]/30 flex flex-col gap-5">

            <div className="flex items-center justify-between text-[13px] font-semibold text-[#A67C2D]">
                <span className="font-serif text-[1.1em]">
                    Question {toRoman(index + 1)} of {toRoman(total)}
                </span>
                <span>{answer.points} {answer.points > 1 ? "points" : "point"}</span>
            </div>

            <h3 className="text-[1.3em] font-bold text-center text-[#3E3025] leading-7">
                {answer.questionText}
            </h3>

            <div className="flex flex-col gap-3" role="group" aria-label="Answer options">
                {answer.options.map((option, i) => {

                    const selected = answer.selectedAnswerIndex === i;

                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(i)}
                            aria-pressed={selected}
                            className={`
                                flex items-center gap-3 w-full text-left p-3 rounded-[5px] border-2
                                cursor-pointer transition-colors duration-150
                                ${selected
                                    ? "bg-[#3E3025] border-[#3E3025] text-[#F0E6D8]"
                                    : "bg-white border-[#3E3025]/40 text-[#3E3025] hover:bg-[#F0E6D8] hover:border-[#3E3025]"}
                            `}
                        >
                            <span
                                className={`
                                    shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
                                    font-serif font-bold
                                    ${selected ? "border-[#F0E6D8] text-[#F0E6D8]" : "border-[#A67C2D] text-[#7A5A14]"}
                                `}
                            >
                                {GREEK[i] ?? i + 1}
                            </span>
                            <span className="font-medium">{option}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(QuestionCard);
