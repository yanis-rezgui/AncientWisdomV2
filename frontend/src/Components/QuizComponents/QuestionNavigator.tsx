import { memo } from "react";
import type { QuizAttemptAnswer } from "../../Types/Types";
import { isAnswered, toRoman } from "../../Types/QuizHelpers";


interface QuestionNavigatorProps {
    answers: QuizAttemptAnswer[];
    current: number;
    onGo: (index: number) => void;
}

const QuestionNavigator = ({ answers, current, onGo }: QuestionNavigatorProps) => (
    <nav aria-label="Questions" className="flex flex-wrap justify-center gap-2">
        {answers.map((answer, i) => {

            const isCurrent = i === current;
            const answered = isAnswered(answer);

            return (
                <button
                    key={i}
                    onClick={() => onGo(i)}
                    aria-current={isCurrent ? "step" : undefined}
                    title={answered ? "Answered" : "Not answered yet"}
                    className={`
                        min-w-10 px-2 py-1.5 rounded-[5px] border-2 border-[#3E3025]
                        text-[13px] font-bold font-serif cursor-pointer transition-colors duration-150
                        ${isCurrent
                            ? "bg-[#3E3025] text-[#F0E6D8]"
                            : answered
                                ? "bg-[#F0E6D8] text-[#3E3025]"
                                : "bg-white text-[#3E3025]/60"}
                    `}
                >
                    {toRoman(i + 1)}
                </button>
            );
        })}
    </nav>
);

export default memo(QuestionNavigator);
