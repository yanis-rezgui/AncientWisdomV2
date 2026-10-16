
/* =========================================================
   PROFILE STATISTICS TYPES
========================================================= */

import type { User } from "./Types";

/* =========================
   PROFILE
========================= */

export interface ProfileStatsUser
    extends Pick<
        User,
        | "_id"
        | "firstName"
        | "lastName"
        | "email"
        | "role"
    > {
    createdAt: string;
    memberSince: string;
}

/* =========================
   PROFILE OVERVIEW STATS
========================= */

export interface ProfileOverviewStats {
    quizzesCompleted: number;
    gamesPlayed: number;
    favorites: number;
}

/* =========================
   QUIZ LEARNING STATS
========================= */

export interface ProfileQuizStats {
    completed: number;
    inProgress: number;
    abandoned: number;

    averagePercentage: number;
    bestPercentage: number;

    // Temps total en secondes
    totalTimeSeconds: number;
}

/* =========================
   GAME LEARNING STATS
========================= */

export interface ProfileGameStats {
    played: number;
    inProgress: number;
    abandoned: number;

    accuracy: number;
    averageScore: number;
    bestScore: number;
    totalPoints: number;

    correctAnswers: number;
    incorrectAnswers: number;
    challengesCompleted: number;
}

/* =========================
   BEST SCORES
========================= */

export interface ProfileBestQuizScore {
    id: string;
    title: string;
    score: number;
    maxScore: number;
    percentage: number;
    date: string | null;
}

export interface ProfileBestGameScore {
    id: string;
    title: string;
    score: number;
    accuracy: number;
    date: string | null;
}

export interface ProfileBestScores {
    quizzes: ProfileBestQuizScore[];
    games: ProfileBestGameScore[];
}

/* =========================
   RECENT ACTIVITY
========================= */

export type ProfileActivityKind = "quiz" | "game";

export type ProfileActivityStatus =
    | "in_progress"
    | "completed"
    | "abandoned";

export interface ProfileRecentActivity {
    id: string;
    kind: ProfileActivityKind;
    title: string;
    status: ProfileActivityStatus;

    score: number;
    maxScore: number | null;
    percentage: number;

    date: string;
}

/* =========================
   LEARNING
========================= */

export interface ProfileLearningStats {
    quizzes: ProfileQuizStats;
    games: ProfileGameStats;
    bestScores: ProfileBestScores;
    recentActivity: ProfileRecentActivity[];
}

/* =========================
   FAVORITES BREAKDOWN
========================= */

export type ProfileFavoriteType =
    | "Quote"
    | "Figure"
    | "Event";

export interface ProfileFavoriteBreakdown {
    _id: ProfileFavoriteType;
    count: number;
}

/* =========================
   COMPLETE RESPONSE DATA
========================= */

export interface ProfileStatsData {
    profile: ProfileStatsUser;
    stats: ProfileOverviewStats;
    learning: ProfileLearningStats;
    favoritesByType: ProfileFavoriteBreakdown[];
}

/* =========================
   API RESPONSE
========================= */

export interface ProfileStatsApiResponse {
    success: boolean;
    data: ProfileStatsData;
    message?: string;
}
