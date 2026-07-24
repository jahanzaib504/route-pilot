import { useState, createContext, useContext } from 'react'
import HomePage from './pages/homePage'
import TripPlannerPage from './pages/tripPlannerPage'
import TripResultPage from './pages/tripResultsPage'
import routeContext from './contexts/routeContext'
import {Route, Routes} from "react-router"
import TripResultRoute from './routes/tripResultRoute'
function App() {
  const [eldLogs, setEldLogs] = useState(null)
  const [loading, setLoading] = useState(false);
  const [routePath, setRoutePath] = useState(null)
  return (
    <>
    <routeContext.Provider value={{eldLogs, setEldLogs, loading, setLoading, routePath, setRoutePath}}>
    <Routes>
        <Route element={<HomePage />} path='/'/>
        <Route element={<TripResultRoute><TripResultPage /></TripResultRoute>} path='/trip-results'/>
        <Route element={<TripPlannerPage />} path='/plan-trip'/>
    </Routes> 
    </routeContext.Provider> 
    </>
  )
}

export default App
