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

function App() {

  return (
    <>
     
      <EraProvider>
        <QuotesProvider>
          <FiguresProvider>
            <EventProvider>
              <AuthProvider>
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
       </Routes>
       </AuthProvider>
       </EventProvider>
       </FiguresProvider>
       </QuotesProvider>
      </EraProvider>
    </>
  )
}

export default App
