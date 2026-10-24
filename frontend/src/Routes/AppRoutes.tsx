
import { Route, Routes } from "react-router-dom";

// Layout and protection
import AdminRoute from "../Layouts/AdminRoute";
import AdminLayout from "../Layouts/AdminLayout";

// Dashboard
import AdminDashboard from "../AdminPages/AdminDashboard";

// Quotes
import AdminQuotes from "../AdminPages/AdminQuotes";

// Eras
import AdminEras from "../AdminPages/AdminEras";
import AdminEraAjout from "../AdminPages/AdminEraAjout";
import AdminEraUpdate from "../AdminPages/AdminEraUpdate";

// Figures
import AdminFigures from "../AdminPages/AdminFigures";
import AdminFigureUpdate from "../AdminPages/AdminFigureUpdate";
import AdminFigureAjout from "../AdminPages/AdminFigureAjout";

// Events
import AdminEvents from "../AdminPages/AdminEvents";
import AdminEventAjout from "../AdminPages/AdminEventAjout";
import AdminEventUpdate from "../AdminPages/AdminEventUpdate";

// Quizzes
import AdminQuizzes from "../AdminPages/AdminQuizzes";
import AdminQuizAjout from "../AdminPages/AdminQuizAjout";
import AdminQuizUpdate from "../AdminPages/AdminQuizUpdate";
import AdminQuizQuestions from "../AdminPages/AdminQuizQuestions";

// Learn management
import AdminLearn from "../AdminPages/AdminLearnPages/AdminLearn";

// Articles
import AdminArticles from "../AdminPages/AdminLearnPages/AdminArticles";
import AdminArticleAjout from "../AdminPages/AdminLearnPages/AdminArticleAjout";
import AdminArticleUpdate from "../AdminPages/AdminLearnPages/AdminArticleUpdate";

// Books
import AdminBooks from "../AdminPages/AdminLearnPages/AdminBooks";
import AdminBookAjout from "../AdminPages/AdminLearnPages/AdminBookAjout";
import AdminBookUpdate from "../AdminPages/AdminLearnPages/AdminBookUpdate";

// Movies
import AdminMovies from "../AdminPages/AdminLearnPages/AdminMovies";
import AdminMovieAjout from "../AdminPages/AdminLearnPages/AdminMovieAjout";
import AdminMovieUpdate from "../AdminPages/AdminLearnPages/AdminMovieUpdate";

// Frames
import AdminFrames from "../AdminPages/AdminLearnPages/AdminFrames";
import AdminFrameAjout from "../AdminPages/AdminLearnPages/AdminFrameAjout";
import AdminFrameUpdate from "../AdminPages/AdminLearnPages/AdminFrameUpdate";

// Tips
import AdminTips from "../AdminPages/AdminLearnPages/AdminTips";

// Users
import AdminUsers from "../AdminPages/AdminUsers";

// Games
import AdminGames from "../AdminPages/AdminGamesPages/AdminGames";
import AdminGameChallenges from "../AdminPages/AdminGamesPages/AdminGameChallenges";
import AdminGameChallengeAjout from "../AdminPages/AdminGamesPages/AdminGameChallengeAjout";
import AdminGameChallengeUpdate from "../AdminPages/AdminGamesPages/AdminGameChallengeUpdate";

// Settings
import AdminSettings from "../AdminPages/AdminSettings";

// Notifications
import AdminNotifications from "../AdminPages/AdminNotifications";

// Profile
import AdminProfile from "../AdminPages/AdminProfile";

// Homepage CMS
import HomePageCMSContent from "../AdminPages/AdminHomePage";

// Help center
import ArticleHelp from "../AdminPages/ArticleHelp";

// Testimonials
import AdminTestimonials from "../AdminPages/AdminTestimonials";

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
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";

function AppRoutes() {
  return (
    <Routes>
       <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Quotes */}
        <Route path="quotes" element={<AdminQuotes />} />

        {/* Era */}
        <Route path="eras" element={<AdminEras />} />
        <Route path="addEra" element={<AdminEraAjout />} />
        <Route path="era/:id" element={<AdminEraUpdate />} />

        {/* Figures */}
        <Route path="figures" element={<AdminFigures />} />
        <Route path="figure/:id" element={<AdminFigureUpdate />} />
        <Route path="addFigure" element={<AdminFigureAjout />} />

        {/* Events */}
        <Route path="events" element={<AdminEvents />} />
        <Route path="addEvent" element={<AdminEventAjout />} />
        <Route path="event/:id" element={<AdminEventUpdate />} />

        {/* Quizzes */}
        <Route path="quizzes" element={<AdminQuizzes />} />
        <Route path="addQuiz" element={<AdminQuizAjout />} />
        <Route path="quiz/:id" element={<AdminQuizUpdate />} />
        <Route
          path="quiz-questions"
          element={<AdminQuizQuestions />}
        />

        {/* Learn */}
        <Route path="learn" element={<AdminLearn />} />

        {/* Articles */}
        <Route path="learn/articles" element={<AdminArticles />} />
        <Route path="learn/addArticle" element={<AdminArticleAjout />} />
        <Route
          path="learn/article/:id"
          element={<AdminArticleUpdate />}
        />

        {/* Books */}
        <Route path="learn/books" element={<AdminBooks />} />
        <Route path="learn/addBook" element={<AdminBookAjout />} />
        <Route
          path="learn/book/:id"
          element={<AdminBookUpdate />}
        />

        {/* Movies */}
        <Route path="learn/movies" element={<AdminMovies />} />
        <Route path="learn/addMovie" element={<AdminMovieAjout />} />
        <Route
          path="learn/movie/:id"
          element={<AdminMovieUpdate />}
        />

        {/* Frames */}
        <Route path="learn/frames" element={<AdminFrames />} />
        <Route path="learn/addFrame" element={<AdminFrameAjout />} />
        <Route
          path="learn/frame/:id"
          element={<AdminFrameUpdate />}
        />

        {/* Tips */}
        <Route path="learn/tips" element={<AdminTips />} />

        {/* Users */}
        <Route path="users" element={<AdminUsers />} />

        {/* Games */}
        <Route path="games" element={<AdminGames />} />
        <Route
          path="games/:game"
          element={<AdminGameChallenges />}
        />
        <Route
          path="games/:game/add"
          element={<AdminGameChallengeAjout />}
        />
        <Route
          path="games/:game/:id"
          element={<AdminGameChallengeUpdate />}
        />

        {/* Settings */}
        <Route path="general" element={<AdminSettings />} />

        {/* Notifications */}
        <Route
          path="notifications"
          element={<AdminNotifications />}
        />

        {/* Profile */}
        <Route path="profile" element={<AdminProfile />} />

        {/* Homepage CMS */}
        <Route
          path="home-page"
          element={<HomePageCMSContent />}
        />

        {/* Help center */}
        <Route path="help" element={<ArticleHelp />} />

        {/* Testimonials */}
        <Route path="testimonials" element={<AdminTestimonials />} />
      </Route>
  


      
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
              <Route path="/forgot-password" element={<ForgotPassword/>}/>
      
              <Route path="/reset-password/:token" element={<ResetPassword/>}/>
            </Route>
       

    </Routes>
  );
}

export default AppRoutes;
