import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import { EraProvider } from './Contexts/EraContext'
import { QuotesProvider } from './Contexts/QuotesContext'
import { FiguresProvider } from './Contexts/FiguresContext'
import Header from './Pages/Header'
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

function App() {

  return (
    <>
     
      <EraProvider>
        <QuotesProvider>
          <FiguresProvider>
            <EventProvider>
              <AuthProvider>
                <SavedItemsProvider>
       <Routes>

        <Route path="/" element={
          <>

          <Header/>
          <Home/>
          
          </>}/>

          <Route path='/quotes' element={
            <>
              <Header/>
              <Quotes/>
            </>
          }/>

          <Route path='/user' element={
            <>
               <Header/>
               <Profile/>
            </>
          }/>

          <Route path='/explore' element={
            <>
              <Header/>
              <Explore/>
            </>
          }/>

          <Route path='/figures' element={
            <>
               <Header/>
               <Figures/>
            </>
          }/>

          <Route path='/figure/:id' element={
            <>
              <Header/>
              <FigureDetails/>
            </>
          }/>


          <Route path='/events' element={
            <>
              <Header/>
              <Events/>
            </>
          }/>

          <Route path='/event/:id' element={
            <>
              <Header/>
              <EventDetails />
            </>
          }/>

          <Route path='/eras' element={
            <>
              <Header/>
              <Eras/>
            </>
          }/>
       </Routes>

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
