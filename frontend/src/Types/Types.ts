

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
    _id : string;
    firstName : string;
    lastName: string;
    email : string;
    password? : string;
    role: string;
    createdAt? : string;
    updatedAt? : string;
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




export type SocialPlatform =
    | "facebook"
    | "instagram"
    | "youtube"
    | "tiktok"
    | "x"
    | "linkedin"
    | "github"
    | "discord"
    | "other";

export interface SocialLink {
    _id?: string;
    platform: SocialPlatform;
    url: string;
    isActive: boolean;
}

export interface Settings {
    _id: string;
    name: string;
    slogan: string;
    email: string;
    socialLinks: SocialLink[];
    createdAt: string;
    updatedAt: string;
}

// Données envoyées lors d'une modification
export type SettingsInput = Partial<
    Pick<Settings, "name" | "slogan" | "email" | "socialLinks">
>;


// =========================================================
// NOTIFICATION TYPES
// =========================================================

export type NotificationType =
| "NEW_USER"
| "NEW_FIGURE"
| "NEW_EVENT"
| "NEW_ERA"
| "NEW_QUOTE"
| "NEW_CHALLENGE"
| "NEW_TESTIMONIAL"
| "CONTENT_DELETED"
| "STATUS_CHANGED"
| "SETTINGS_UPDATED"
| "ACHIEVEMENT_UNLOCKED"
| "QUIZ_COMPLETED"
| "ACCOUNT_UPDATED"
| "SECURITY";

// =========================================================
// NOTIFICATION
// =========================================================

export interface Notification {
_id: string;
title: string;
message: string;
type: NotificationType;
recipient: string;
read: boolean;
createdAt: string;
}

// =========================================================
// PAGINATION
// =========================================================

export interface NotificationsPagination {
page: number;
limit: number;
total: number;
totalPages: number;
}

// =========================================================
// STATISTICS
// =========================================================

export interface NotificationsStats {
total: number;
unread: number;
read: number;
}


/* =========================================================
   ADMIN DASHBOARD TYPES (alignés sur getAdminDashboard)
========================================================= */

export interface CountByKey { _id: string | null; count: number }
export interface DashboardMonthlyStat { month: string; count: number }

export interface DashboardRecentUser {
    _id: string; firstName: string; lastName: string; email: string;
    role: "USER" | "ADMIN"; createdAt: string;
}

export interface DashboardRecentContent {
    id: string; type: string; title: string; status: string | null; createdAt: string;
}

export interface DashboardNotification {
    _id: string; title: string; message: string; type: string; read: boolean; createdAt: string;
    recipient?: { firstName: string; lastName: string; email: string } | null;
}

export interface AdminDashboardData {
    overview: {
        totalUsers: number; totalAdmins: number; totalHistoricalContent: number;
        totalQuizzes: number; totalQuestions: number; totalGames: number; totalChallenges: number;
        totalQuizAttempts: number; totalGameSessions: number; totalFavorites: number;
        totalNotifications: number; unreadNotifications: number;
    };
    community: {
        totalUsers: number; totalAdmins: number; regularUsers: number;
        newUsersLast7Days: number; newUsersLast30Days: number; activeLearnersLast30Days: number;
        monthlyRegistrations: DashboardMonthlyStat[];
        recentUsers: DashboardRecentUser[];
    };
    content: {
        total: number;
        breakdown: Record<string, number>;
        framesByType: CountByKey[];
        createdLast30Days: { figures: number; events: number; articles: number };
    };
    quizzes: {
        total: number;
        byStatus: Record<string, number>;
        byDifficulty: CountByKey[];
        questions: { total: number; byStatus: Record<string, number>; byDifficulty: CountByKey[] };
        attempts: {
            total: number; last30Days: number; byStatus: Record<string, number>;
            completionRate: number; abandonmentRate: number;
            averagePercentage: number; averageScore: number; averageMaxScore: number;
            averageDurationSeconds: number;
        };
    };
    games: {
        total: number;
        byStatus: Record<string, number>;
        byType: CountByKey[];
        challenges: { total: number; byType: { type: string; total: number }[] };
        sessions: {
            total: number; last30Days: number; byStatus: Record<string, number>;
            completionRate: number; abandonmentRate: number;
            averageScore: number; averageDurationSeconds: number;
            correctAnswers: number; incorrectAnswers: number; totalQuestions: number;
            totalPointsEarned: number; answerAccuracy: number;
        };
    };
    engagement: {
        totalFavorites: number;
        favoritesByType: CountByKey[];
        notifications: { total: number; unread: number; recent: DashboardNotification[] };
    };
    recentContent: DashboardRecentContent[];
    generatedAt: string;
}



export type Testimonial = {
  _id?: string;
  fullName: string;
  message: string;
  rating: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};
