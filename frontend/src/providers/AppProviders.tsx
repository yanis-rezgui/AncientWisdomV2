
import type {  PropsWithChildren, ReactNode } from "react";

// Public contexts
import { EraProvider } from "../Contexts/EraContext";
import { QuotesProvider } from "../Contexts/QuotesContext";
import { FiguresProvider } from "../Contexts/FiguresContext";
import { EventProvider } from "../Contexts/EventContext";
import { AuthProvider } from "../Contexts/AuthContext";
import { SavedItemsProvider } from "../Contexts/SavedItemsContext";
import { QuizProvider } from "../Contexts/QuizContext";
import { TipsProvider } from "../Contexts/TipsContext";
import { BookProvider } from "../Contexts/BookContext";
import { MovieProvider } from "../Contexts/MovieContext";
import { ArticleProvider } from "../Contexts/ArticleContext";
import { FrameProvider } from "../Contexts/FrameContext";
import { GamesProvider } from "../Contexts/GamesContexts/GamesContext";
import { FigureChallengeProvider } from "../Contexts/GamesContexts/FigureChallengeContext";
import { LandmarkChallengeProvider } from "../Contexts/GamesContexts/LandmarkChallengeContext";
import { WordChallengeProvider } from "../Contexts/GamesContexts/WordChallengeContext";
import { MemoryChallengeProvider } from "../Contexts/GamesContexts/MemoryChallengeContext";
import { LocationChallengeProvider } from "../Contexts/GamesContexts/LocationChallengeContext";
import { SettingsProvider } from "../Contexts/SettingsContext";
import { NotificationsProvider } from "../Contexts/NotificationsContext";
import { ProfileStatsProvider } from "../Contexts/ProfileStatsContext";
import { HelpCenterProvider } from "../Contexts/HelpCenterContext";
import { TestimonialsProvider } from "../Contexts/TestimonialsContext";

// Admin contexts
import { QuotesAdminProvider } from "../AdminContexts/QuotesAdminContext";
import { ErasAdminProvider } from "../AdminContexts/ErasAdminContext";
import { FiguresAdminProvider } from "../AdminContexts/FigureAdminContext";
import { EventsAdminProvider } from "../AdminContexts/EventsAdminContext";
import { QuizAdminProvider } from "../AdminContexts/QuizAdminContext";
import { QuizQuestionsAdminProvider } from "../AdminContexts/QuizQuestionsAdminContext";
import { BooksAdminProvider } from "../AdminContexts/BookAdminContext";
import { MoviesAdminProvider } from "../AdminContexts/MovieAdminContext";
import { ArticleAdminProvider } from "../AdminContexts/ArticleAdminContext";
import { FramesAdminProvider } from "../AdminContexts/FramesAdminContext";
import { UsersAdminProvider } from "../AdminContexts/UsersAdminContext";

import { FigureChallengesAdminProvider } from "../AdminContexts/GamesAdminContext/FigureChallengesAdminContext";
import { LandmarkChallengesAdminProvider } from "../AdminContexts/GamesAdminContext/LandmarkChallengesAdminContext";
import { WordChallengesAdminProvider } from "../AdminContexts/GamesAdminContext/WordChallengesAdminContext";
import { MemoryChallengesAdminProvider } from "../AdminContexts/GamesAdminContext/MemoryChallengesAdminContext";
import { LocationChallengesAdminProvider } from "../AdminContexts/GamesAdminContext/LocationChallengesAdminContext";

import { DashboardProvider } from "../AdminContexts/DashboardContext";
import { HomePageProvider } from "../AdminContexts/HomePageContext";
import { HelpArticleAdminProvider } from "../AdminContexts/HelpArticleAdminContext";
import { HelpCategoryAdminProvider } from "../AdminContexts/HelpCategoryAdminContext";



const providers = [
    EraProvider,
    QuotesProvider,
    FiguresProvider,
    EventProvider,
    AuthProvider,
    SavedItemsProvider,

    QuotesAdminProvider,
    ErasAdminProvider,
    FiguresAdminProvider,
    EventsAdminProvider,

    QuizProvider,
    TipsProvider,
    QuizAdminProvider,
    QuizQuestionsAdminProvider,

    BookProvider,
    BooksAdminProvider,
    MovieProvider,
    MoviesAdminProvider,
    ArticleProvider,
    ArticleAdminProvider,
    FrameProvider,
    FramesAdminProvider,

    UsersAdminProvider,

    GamesProvider,
    FigureChallengeProvider,
    LandmarkChallengeProvider,
    WordChallengeProvider,
    MemoryChallengeProvider,
    LocationChallengeProvider,

    FigureChallengesAdminProvider,
    LandmarkChallengesAdminProvider,
    WordChallengesAdminProvider,
    MemoryChallengesAdminProvider,
    LocationChallengesAdminProvider,

    SettingsProvider,
    NotificationsProvider,
    DashboardProvider,
    ProfileStatsProvider,
    HomePageProvider,
    HelpArticleAdminProvider,
    HelpCategoryAdminProvider,
    HelpCenterProvider,
    TestimonialsProvider,
];

interface AppProvidersProps extends PropsWithChildren {
    children: ReactNode;
}

export default function AppProviders({
    children,
}: AppProvidersProps) {
    return providers.reduceRight(
        (content, Provider) => (
            <Provider>{content}</Provider>
        ),
        children,
    );
}
