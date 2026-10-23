import { Routes, Route } from "react-router-dom";

// Route protection and layout
import PublicRoute from "../Layouts/PublicRoute";
import PublicLayout from "../Layouts/PublicLayout";

// Main pages
import Home from "../Pages/Home";
import Quotes from "../Pages/Quotes";
import Profile from "../Pages/Profile";
import Explore from "../Pages/Explore";

// Figures
import Figures from "../Pages/Figures";
import FigureDetails from "../Pages/FigureDetails";

// Events
import Events from "../Pages/Events";
import EventDetails from "../Pages/EventDetails";

// Eras and quotes
import Eras from "../Pages/Eras";
import EraDetails from "../Pages/EraDetails";
import QuoteDetails from "../Pages/QuoteDetails";

// Quizzes
import Quizzes from "../Pages/Quizzes";
import QuizDetails from "../Pages/QuizDetails";
import QuizPlay from "../Pages/QuizPlay";
import QuizResult from "../Pages/QuizResult";
import QuizHistory from "../Pages/QuizHistory";

// Learn
import Learn from "../Pages/LearnPages/Learn";
import Frames from "../Pages/LearnPages/Frames";
import Books from "../Pages/LearnPages/Books";
import Movies from "../Pages/LearnPages/Movies";
import Guides from "../Pages/LearnPages/Guides";
import Articles from "../Pages/LearnPages/Articles";
import ArticleDetails from "../Pages/LearnPages/ArticleDetails";

// Favorites
import Favorites from "../Pages/Favorites";

// Games
import Games from "../Pages/GamePages/Games";
import GameDetails from "../Pages/GamePages/GameDetails";
import GamePlay from "../Pages/GamePages/GamePlay";

// Notifications
import Notifications from "../Pages/Notifications";

// Help center
import HelpCenter from "../Pages/HelpCenter";
import HelpArticleDetails from "../Pages/HelpArticleDetails";

// Legal Pages
import LegalNotice from "../Pages/LegalNotice";
import PrivacyPolicy from "../Pages/PrivacyPolicy";

// Hermes AI
import Hermes from "../Pages/Hermes";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route
        element={
          <PublicRoute>
            <PublicLayout />
          </PublicRoute>
        }
      >
        <Route path="/" element={<Home />} />

        <Route path="/quotes" element={<Quotes />} />
        <Route path="/user" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />

        <Route path="/figures" element={<Figures />} />
        <Route path="/figure/:id" element={<FigureDetails />} />

        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetails />} />

        <Route path="/eras" element={<Eras />} />
        <Route path="/era/:id" element={<EraDetails />} />
        <Route path="/quote/:id" element={<QuoteDetails />} />

        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz/:id" element={<QuizDetails />} />
        <Route path="/quiz-play/:attemptId" element={<QuizPlay />} />
        <Route path="/quiz-result/:attemptId" element={<QuizResult />} />
        <Route path="/quiz-history" element={<QuizHistory />} />

        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/frames" element={<Frames />} />
        <Route path="/learn/books" element={<Books />} />
        <Route path="/learn/movies" element={<Movies />} />
        <Route path="/learn/guides" element={<Guides />} />
        <Route path="/learn/articles" element={<Articles />} />
        <Route path="/article/:id" element={<ArticleDetails />} />

        <Route path="/favorites" element={<Favorites />} />

        <Route path="/games" element={<Games />} />
        <Route path="/game/:id" element={<GameDetails />} />
        <Route path="/game/:id/play" element={<GamePlay />} />

        <Route path="/notifications" element={<Notifications />} />

        <Route path="/help" element={<HelpCenter />} />
        <Route path="/help/:slug" element={<HelpArticleDetails />} />

        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/hermes-ai" element={<Hermes />} />
      </Route>
    </Routes>
  );
}