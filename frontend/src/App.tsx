import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import { EraProvider } from './Contexts/EraContext'
import { QuotesProvider } from './Contexts/QuotesContext'
import { FiguresProvider } from './Contexts/FiguresContext'
import Quotes from './Pages/Quotes'
import { EventProvider } from './Contexts/EventContext'
import { AuthProvider } from './Contexts/AuthContext'
import Profile from './Pages/Profile'
import { SavedItemsProvider } from './Contexts/SavedItemsContext'
import Explore from './Pages/Explore'
import Figures from './Pages/Figures'
import FigureDetails from './Pages/FigureDetails'
import Events from './Pages/Events'
import EventDetails from './Pages/EventDetails'
import Eras from './Pages/Eras'
import EraDetails from './Pages/EraDetails'
import QuoteDetails from './Pages/QuoteDetails'
import PublicRoute from './Layouts/PublicRoute'
import PublicLayout from './Layouts/PublicLayout'
import AdminRoute from './Layouts/AdminRoute'
import AdminLayout from './Layouts/AdminLayout'
import Dashboard from './AdminPages/Dashboard'
import AdminQuotes from './AdminPages/AdminQuotes'
import { QuotesAdminProvider } from './AdminContexts/QuotesAdminContext'
import { ErasAdminProvider } from './AdminContexts/ErasAdminContext'
import AdminEras from './AdminPages/AdminEras'
import AdminEraAjout from './AdminPages/AdminEraAjout'
import AdminEraUpdate from './AdminPages/AdminEraUpdate'
import AdminFigures from './AdminPages/AdminFigures'
import { FiguresAdminProvider } from './AdminContexts/FigureAdminContext'
import AdminFigureUpdate from './AdminPages/AdminFigureUpdate'
import AdminFigureAjout from './AdminPages/AdminFigureAjout'
import AdminEvents from './AdminPages/AdminEvents'
import { EventsAdminProvider } from './AdminContexts/EventsAdminContext'
import AdminEventAjout from './AdminPages/AdminEventAjout'
import AdminEventUpdate from './AdminPages/AdminEventUpdate'
import Quizzes from './Pages/Quizzes'
import QuizDetails from './Pages/QuizDetails'
import QuizPlay from './Pages/QuizPlay'
import QuizResult from './Pages/QuizResult'
import QuizHistory from './Pages/QuizHistory'
import { QuizProvider } from './Contexts/QuizContext'
import { TipsProvider } from './Contexts/TipsContext'
import { QuizAdminProvider } from './AdminContexts/QuizAdminContext'
import { QuizQuestionsAdminProvider } from './AdminContexts/QuizQuestionsAdminContext'
import AdminQuizzes from './AdminPages/AdminQuizzes'
import AdminQuizAjout from './AdminPages/AdminQuizAjout'
import AdminQuizUpdate from './AdminPages/AdminQuizUpdate'
import AdminQuizQuestions from './AdminPages/AdminQuizQuestions'
import { BookProvider } from './Contexts/BookContext'
import { BooksAdminProvider } from './AdminContexts/BookAdminContext'
import { MovieProvider } from './Contexts/MovieContext'
import { MoviesAdminProvider } from './AdminContexts/MovieAdminContext'
import { ArticleProvider } from './Contexts/ArticleContext'
import { ArticleAdminProvider } from './AdminContexts/ArticleAdminContext'
import { FrameProvider } from './Contexts/FrameContext'
import { FramesAdminProvider } from './AdminContexts/FramesAdminContext'
import AdminLearn from './AdminPages/AdminLearnPages/AdminLearn'
import AdminArticles from './AdminPages/AdminLearnPages/AdminArticles'
import AdminArticleAjout from './AdminPages/AdminLearnPages/AdminArticleAjout'
import AdminArticleUpdate from './AdminPages/AdminLearnPages/AdminArticleUpdate'
import AdminBooks from './AdminPages/AdminLearnPages/AdminBooks'
import AdminBookAjout from './AdminPages/AdminLearnPages/AdminBookAjout'
import AdminBookUpdate from './AdminPages/AdminLearnPages/AdminBookUpdate'
import AdminMovies from './AdminPages/AdminLearnPages/AdminMovies'
import AdminMovieAjout from './AdminPages/AdminLearnPages/AdminMovieAjout'
import AdminMovieUpdate from './AdminPages/AdminLearnPages/AdminMovieUpdate'
import AdminFrames from './AdminPages/AdminLearnPages/AdminFrames'
import AdminFrameAjout from './AdminPages/AdminLearnPages/AdminFrameAjout'
import AdminFrameUpdate from './AdminPages/AdminLearnPages/AdminFrameUpdate'
import AdminTips from './AdminPages/AdminLearnPages/AdminTips'
import Learn from './Pages/LearnPages/Learn'
import Frames from './Pages/LearnPages/Frames'
import Books from './Pages/LearnPages/Books'
import Movies from './Pages/LearnPages/Movies'
import Guides from './Pages/LearnPages/Guides'
import Articles from './Pages/LearnPages/Articles'
import ArticleDetails from './Pages/LearnPages/ArticleDetails'
import Favorites from './Pages/Favorites'
import { UsersAdminProvider } from './AdminContexts/UsersAdminContext'
import AdminUsers from './AdminPages/AdminUsers'
import { GamesProvider } from './Contexts/GamesContexts/GamesContext'
import { FigureChallengeProvider } from './Contexts/GamesContexts/FigureChallengeContext'
import Games from './Pages/GamePages/Games'
import GameDetails from './Pages/GamePages/GameDetails'
import GamePlay from './Pages/GamePages/GamePlay'
import { LandmarkChallengeProvider } from './Contexts/GamesContexts/LandmarkChallengeContext'
import { WordChallengeProvider } from './Contexts/GamesContexts/WordChallengeContext'
import { MemoryChallengeProvider } from './Contexts/GamesContexts/MemoryChallengeContext'
import { LocationChallengeProvider } from './Contexts/GamesContexts/LocationChallengeContext'
import { FigureChallengesAdminProvider } from './AdminContexts/GamesAdminContext/FigureChallengesAdminContext'
import { LandmarkChallengesAdminProvider } from './AdminContexts/GamesAdminContext/LandmarkChallengesAdminContext'
import { WordChallengesAdminProvider } from './AdminContexts/GamesAdminContext/WordChallengesAdminContext'
import { MemoryChallengesAdminProvider } from './AdminContexts/GamesAdminContext/MemoryChallengesAdminContext'

function App() {

  return (
    <>
     
      <EraProvider>
        <QuotesProvider>
          <FiguresProvider>
            <EventProvider>
              <AuthProvider>
                <SavedItemsProvider>
                  <QuotesAdminProvider>
                    <ErasAdminProvider>
                      <FiguresAdminProvider>
                        <EventsAdminProvider>
                          <QuizProvider>
                            <TipsProvider>
                              <QuizAdminProvider>
                                <QuizQuestionsAdminProvider>
                                  <BookProvider>
                                    <BooksAdminProvider>
                                      <MovieProvider>
                                        <MoviesAdminProvider>
                                          <ArticleProvider>
                                            <ArticleAdminProvider>
                                              <FrameProvider>
                                                <FramesAdminProvider>
                                                  <UsersAdminProvider>
                                                    <GamesProvider>
                                                      <FigureChallengeProvider>
                                                        <LandmarkChallengeProvider>
                                                          <WordChallengeProvider>
                                                            <MemoryChallengeProvider>
                                                              <LocationChallengeProvider>
                                                                <FigureChallengesAdminProvider>
                                                                  <LandmarkChallengesAdminProvider>
                                                                    <WordChallengesAdminProvider>
                                                                      <MemoryChallengesAdminProvider>
       <Routes>

        <Route element={
          <PublicRoute>
            <PublicLayout/>
          </PublicRoute>
        }>


      

        <Route path="/" element={
          <>

          
          <Home/>
          
          </>}/>

          <Route path='/quotes' element={
            <>
              
              <Quotes/>
            </>
          }/>

          <Route path='/user' element={
            <>
               
               <Profile/>
            </>
          }/>

          <Route path='/explore' element={
            <>
              
              <Explore/>
            </>
          }/>

          <Route path='/figures' element={
            <>
               
               <Figures/>
            </>
          }/>

          <Route path='/figure/:id' element={
            <>
              
              <FigureDetails/>
            </>
          }/>


          <Route path='/events' element={
            <>
              
              <Events/>
            </>
          }/>

          <Route path='/event/:id' element={
            <>
              
              <EventDetails />
            </>
          }/>

          <Route path='/eras' element={
            <>
              
              <Eras/>
            </>
          }/>

          <Route path='/era/:id' element={
            <>
               
               <EraDetails/>
            </>
          }/>

          <Route path='/quote/:id' element={
            <>
              
              <QuoteDetails/>
            </>
          }/>

          <Route path='/quizzes' element={<Quizzes/>}/>
          <Route path='/quiz/:id' element={<QuizDetails/>}/>
          <Route path='/quiz-play/:attemptId' element={<QuizPlay/>}/>
          <Route path='/quiz-result/:attemptId' element={<QuizResult/>}/>
          <Route path='/quiz-history' element={<QuizHistory/>}/>

          <Route path='/learn' element={<Learn/>}/>
          <Route path='/learn/frames' element={<Frames/>}/>
          <Route path='/learn/books' element={<Books/>}/>
          <Route path='/learn/movies' element={<Movies/>}/>
          <Route path='/learn/guides' element={<Guides/>}/>
          <Route path='/learn/articles' element={<Articles/>}/>
          <Route path='/article/:id' element={<ArticleDetails/>}/>

          <Route path='/favorites' element={<Favorites/>}/>
          <Route path='/games' element={<Games/>}/>

<Route path="/game/:id" element={<GameDetails />} />
<Route path="/game/:id/play" element={<GamePlay />} />
    

            </Route>


            <Route path='/admin/*' element={
              <AdminRoute>
                <AdminLayout/>
              </AdminRoute>
            }>

               <Route path='dashboard' element={<Dashboard/>}/>
               <Route path='quotes' element={<AdminQuotes/>}/>
               <Route path='eras' element={<AdminEras/>}/>
               <Route path='addEra' element={<AdminEraAjout/>}/>
               <Route path='era/:id' element={<AdminEraUpdate/>}/>
               <Route path='figures' element={<AdminFigures/>}/>
               <Route path='figure/:id' element={<AdminFigureUpdate/>}/>
               <Route path='addFigure' element={<AdminFigureAjout/>}/>
               <Route path='events' element={<AdminEvents/>}/>
               <Route path='addEvent' element={<AdminEventAjout/>}/>
               <Route path='event/:id' element={<AdminEventUpdate/>}/>
               <Route path='quizzes' element={<AdminQuizzes/>}/>
<Route path='addQuiz' element={<AdminQuizAjout/>}/>
<Route path='quiz/:id' element={<AdminQuizUpdate/>}/>
<Route path='quiz-questions' element={<AdminQuizQuestions/>}/>
<Route path='learn' element={<AdminLearn/>}/>
<Route path='learn/articles' element={<AdminArticles/>}/>
<Route path='learn/addArticle' element={<AdminArticleAjout/>}/>
<Route path='learn/article/:id' element={<AdminArticleUpdate/>}/>
<Route path='learn/books' element={<AdminBooks/>}/>
<Route path='learn/addBook' element={<AdminBookAjout/>}/>
<Route path='learn/book/:id' element={<AdminBookUpdate/>}/>
<Route path='learn/movies' element={<AdminMovies/>}/>
<Route path='learn/addMovie' element={<AdminMovieAjout/>}/>
<Route path='learn/movie/:id' element={<AdminMovieUpdate/>}/>
<Route path='learn/frames' element={<AdminFrames/>}/>
<Route path='learn/addFrame' element={<AdminFrameAjout/>}/>
<Route path='learn/frame/:id' element={<AdminFrameUpdate/>}/>
<Route path='learn/tips' element={<AdminTips/>}/>
<Route path='users' element={<AdminUsers/>}/>


            </Route>
       </Routes>
                                                                                               
                                                                                                 </MemoryChallengesAdminProvider>
                                                                                               </WordChallengesAdminProvider>
                                                                                          </LandmarkChallengesAdminProvider>
                                                                                    </FigureChallengesAdminProvider>
                                                                              </LocationChallengeProvider>
                                                                             </MemoryChallengeProvider>
                                                                         </WordChallengeProvider>
                                                                       </LandmarkChallengeProvider>
                                                                  </FigureChallengeProvider>
                                                                </GamesProvider>
                                                              </UsersAdminProvider>
                                                          </FramesAdminProvider>
                                                        </FrameProvider>
                                                  </ArticleAdminProvider>
                                            </ArticleProvider>
                                         </MoviesAdminProvider>
                                       </MovieProvider>
                                     </BooksAdminProvider>
                                  </BookProvider>
                             </QuizQuestionsAdminProvider>
                          </QuizAdminProvider>
                        </TipsProvider>
                     </QuizProvider>
                 </EventsAdminProvider>
                </FiguresAdminProvider>
           </ErasAdminProvider>
         </QuotesAdminProvider>
       </SavedItemsProvider>
       </AuthProvider>
       </EventProvider>
       </FiguresProvider>
       </QuotesProvider>
      </EraProvider>
    </>
  )
}

export default App
