

export interface Image {
    url: string;
    publicId: string;
}

export interface BiographySection {
    title: string;
    content: string;
}

/* =========================
   HISTORICAL ERA
========================= */

export interface HistoricalEra {
    _id: string;
    name: string;
    startYear: number;
    endYear: number;
    description: string;
    image: Image;
    createdAt: string;
    updatedAt: string;
    sections : BiographySection[];
}


/* =========================
   HISTORICAL FIGURE
========================= */

export interface HistoricalFigure {
    _id: string;
    name: string;
    birthDate: string;
    birthPlace: string;
    deathDate: string;
    deathPlace: string;

    // Populated by the API
    eras: HistoricalEra[];

    biography: BiographySection[];

    image: Image;

    tags: string[];

    createdAt: string;
    updatedAt: string;
}


/* =========================
   EVENT
========================= */

export interface EventSection {
    title: string;
    content: string;
}

export interface HistoricalEvent {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;

    // Populated by the API
    era: HistoricalEra;

    description?: string;

    sections: EventSection[];

    tags: string[];

    createdAt: string;
    updatedAt: string;
}


/* =========================
   QUOTE
========================= */

export interface Quote {
    _id: string;
    text: string;

    // Populated by the API
    author: HistoricalFigure;

    // Populated by the API
    era: HistoricalEra;

    source: string;
    tags: string[];

    createdAt: string;
    updatedAt: string;
}


/* =========================
   PAGINATION
========================= */

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}


export interface EventFilterType{
    search : string;
    era: string;
}

export interface FigureFilterType{
    search : string;
    era : string;
}

export interface QuoteFilterType{
    search : string,
    era : string,
    author : string
}


export interface FilterOptionsType{
    _id : string;
    name : string;
}


export interface User{
    firstName : string;
    lastName: string;
    email : string;
    password? : string;
    role: string;
}

export type ItemType = "Quote" | "Figure" | "Event";

/* =========================
   QUIZ
========================= */

export type QuizDifficulty = "Easy" | "Medium" | "Hard";

export type QuizStatus = "draft" | "published" | "archived";

export interface QuizQuestionReference {
    // ObjectId string before populate, QuizQuestion after populate
    question: string | IQuizQuestion;
    order: number;
    points: number;
}

export interface Quiz {
    _id: string;
    title: string;
    slug: string;
    description: string;

    // Populated by the API, or IDs if not populated
    eras: (HistoricalEra | string)[];

    difficulty: QuizDifficulty;
    questions: QuizQuestionReference[];

    // Duration in minutes; null means unlimited
    timeLimit: number | null;

    status: QuizStatus;

    createdAt: string;
    updatedAt: string;
}


/* =========================
   QUIZ QUESTION
========================= */

export type QuizQuestionDifficulty = "Easy" | "Medium" | "Hard"; 
export type QuizQuestionStatus = "draft" | "published" | "archived";
 export interface IQuizQuestion 
 { _id: string;
     questionText: string; 
     options: string[]; 
     correctAnswerIndex: number; 
     explanation: string; 
     era?: HistoricalEra; 
     difficulty: QuizQuestionDifficulty; 
     source: string; 
     tags: string[]; 
     status: QuizQuestionStatus; 
     createdAt: Date; 
     updatedAt: Date; }

/* =========================
   QUIZ ATTEMPT
========================= */

export type QuizAttemptStatus =
    | "in_progress"
    | "completed"
    | "abandoned";

export interface QuizAttemptAnswer {
    question: string | IQuizQuestion;

    // Snapshot of the question at the time of the attempt
    questionText: string;
    options: string[];
    correctAnswerIndex: number;

    selectedAnswerIndex: number | null;
    isCorrect: boolean | null;

    points: number;
    earnedPoints: number;
}

export interface QuizAttempt {
    _id: string;

    user: string | User;
    quiz: string | Quiz;

    quizTitle: string;
    answers: QuizAttemptAnswer[];

    score: number;
    maxScore: number;
    percentage: number;

    status: QuizAttemptStatus;

    startedAt: string;
    completedAt: string | null;
    durationSeconds: number;

    createdAt: string;
    updatedAt: string;
}


/* =========================
   QUIZ FILTERS
========================= */

export interface QuizFilterType {
    search: string;
    difficulty: QuizDifficulty | "";
    era: string;
}



/* =========================
   QUIZ PLAY
========================= */

