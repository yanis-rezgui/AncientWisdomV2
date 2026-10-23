
import { Routes, Route } from "react-router-dom";

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

export default function AdminRoutes() {
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
    </Routes>
  );
}
