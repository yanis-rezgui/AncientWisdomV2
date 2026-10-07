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
            </Route>
       </Routes>

       

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
