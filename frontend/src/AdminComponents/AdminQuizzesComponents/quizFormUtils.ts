import type { Quiz, QuizDifficulty, QuizStatus } from "../../Types/Types";
import type { QuizPayload } from "../../AdminContexts/QuizAdminContext";
import { getRefId } from "../../Types/QuizHelpers";


export interface QuizQuestionItemForm {
    question: string;      // id de la question
    questionText: string;  // affichage uniquement
    points: number;
}

export interface QuizFormState {
    title: string;
    slug: string;
    description: string;
    eras: string[];
    difficulty: QuizDifficulty;
    timeLimit: string; // "" = illimité
    status: QuizStatus;
    questions: QuizQuestionItemForm[];
}

export const emptyQuizForm: QuizFormState = {
    title: "",
    slug: "",
    description: "",
    eras: [],
    difficulty: "Medium",
    timeLimit: "",
    status: "draft",
    questions: [],
};

export const quizToForm = (quiz: Quiz): QuizFormState => ({
    title: quiz.title,
    slug: quiz.slug,
    description: quiz.description,
    eras: quiz.eras.map(getRefId),
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit ? String(quiz.timeLimit) : "",
    status: quiz.status,
    questions: [...quiz.questions]
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
            question: getRefId(item.question),
            questionText:
                typeof item.question === "string" ? "(question not loaded)" : item.question.questionText,
            points: item.points,
        })),
});

export const validateQuizForm = (form: QuizFormState): string | null => {
    if (form.title.trim() === "") return "Quiz title is required.";
    if (form.description.trim() === "") return "Quiz description is required.";

    if (form.timeLimit.trim() !== "") {
        const t = Number(form.timeLimit);
        if (!Number.isFinite(t) || t < 1) return "Time limit must be a positive number of minutes.";
    }

    if (form.questions.some((q) => !Number.isInteger(q.points) || q.points < 1)) {
        return "Each question needs points of 1 or more.";
    }

    if (form.status === "published" && form.questions.length === 0) {
        return "A published quiz must contain at least one question.";
    }

    return null;
};

export const buildQuizPayload = (form: QuizFormState): QuizPayload => ({
    title: form.title.trim(),
    description: form.description.trim(),
    ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
    eras: form.eras,
    questions: form.questions.map((q, i) => ({ question: q.question, order: i + 1, points: q.points })),
    difficulty: form.difficulty,
    timeLimit: form.timeLimit.trim() === "" ? null : Number(form.timeLimit),
    status: form.status,
});