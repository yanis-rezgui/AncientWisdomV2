import type { IQuizQuestion, QuizQuestionDifficulty, QuizQuestionStatus } from "../../Types/Types";
import type { QuestionPayload } from "../../AdminContexts/QuizQuestionsAdminContext";

export interface QuestionFormState {
    questionText: string;
    options: string[]; // 4
    correctAnswerIndex: number;
    explanation: string;
    era: string;
    difficulty: QuizQuestionDifficulty;
    source: string;
    tags: string; // séparés par des virgules
    status: QuizQuestionStatus;
}

export const emptyQuestionForm: QuestionFormState = {
    questionText: "",
    options: ["", "", "", ""],
    correctAnswerIndex: 0,
    explanation: "",
    era: "",
    difficulty: "Easy",
    source: "",
    tags: "",
    status: "draft",
};

export const questionToForm = (q: IQuizQuestion): QuestionFormState => ({
    questionText: q.questionText,
    options: [...q.options],
    correctAnswerIndex: q.correctAnswerIndex,
    explanation: q.explanation ?? "",
    era: q.era?._id ?? "",
    difficulty: q.difficulty,
    source: q.source ?? "",
    tags: (q.tags ?? []).join(", "),
    status: q.status,
});

export const validateQuestionForm = (form: QuestionFormState): string | null => {
    if (form.questionText.trim().length < 10) return "Question text must contain at least 10 characters.";

    const options = form.options.map((o) => o.trim());

    if (options.some((o) => o === "")) return "All four options are required.";
    if (new Set(options.map((o) => o.toLowerCase())).size !== 4) return "Answer options must be unique.";
    if (!form.era) return "Please choose an era.";

    return null;
};

export const buildQuestionPayload = (form: QuestionFormState): QuestionPayload => ({
    questionText: form.questionText.trim(),
    options: form.options.map((o) => o.trim()),
    correctAnswerIndex: form.correctAnswerIndex,
    explanation: form.explanation.trim(),
    era: form.era,
    difficulty: form.difficulty,
    source: form.source.trim(),
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    status: form.status,
});