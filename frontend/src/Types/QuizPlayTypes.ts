import type { HistoricalEra, Quiz, QuizAttempt } from "./Types";

/* Question as returned by GET /quizzes/:id (no answer key) */
export interface PlayableQuestion {
    questionId: string;
    questionText: string;
    options: string[];
    explanation?: string;
    order: number;
    points: number;
}

/* Quiz as returned by GET /quizzes/:id */
export interface PlayableQuiz extends Omit<Quiz, "eras" | "questions"> {
    eras: HistoricalEra[];
    questionCount: number;
    questions: PlayableQuestion[];
}

/* Quiz as returned by GET /quizzes (list) */
export interface QuizListItem extends Quiz {
    questionCount: number;
}

/* Attempt as returned by GET /quiz-attempts/me (history) */
export type QuizAttemptSummary = Pick<
    QuizAttempt,
    | "_id"
    | "quiz"
    | "quizTitle"
    | "score"
    | "maxScore"
    | "percentage"
    | "status"
    | "startedAt"
    | "completedAt"
    | "durationSeconds"
    | "createdAt"
>;