import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";

import DefaultLayout from "./layout/DefaultLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InstructionsPage from "./pages/InstructionsPage";


import LeaderboardPage from "./pages/LeaderboardPage";
import GamePage from "./pages/GamePage";
import NotFoundPage from "./pages/NotFoundPage";
import API from "../API.js";

function ProtectedRoute({ loggedIn, children }) {
  const location = useLocation();
  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => { //TODO spinner temporaneo mentre apetto che si carichi la sessione
    API.getSession()
      .then(u => { setLoggedIn(true); setUser(u); })
      .catch(() => {});
  }, []);

  function handleLogin(credentials) {
    return API.login(credentials)
      .then(u => { setLoggedIn(true); setUser(u); }) //TODO capire come gli errori poi li gestisce il login
  }

  function handleLogout() {
    API.logout().then(() => { setLoggedIn(false); setUser(null); navigate('/'); });
  }

  return (
    <Routes>
      <Route element={<DefaultLayout loggedIn={loggedIn} user={user} message={message} setMessage={setMessage} 
        handleLogout={handleLogout}/>}>
        
        <Route index element={<HomePage loggedIn={loggedIn} />} />

        <Route path="/login" element={loggedIn ? <Navigate replace to="/" /> : <LoginPage handleLogin={handleLogin} />} />
        
        <Route path="/instructions" element={<InstructionsPage loggedIn={loggedIn} />} />
        
        <Route path="/leaderboard" element={<ProtectedRoute loggedIn={loggedIn}><LeaderboardPage /></ProtectedRoute>} />


        <Route path="/game/:id" element={<ProtectedRoute loggedIn={loggedIn}><GamePage user={user} setMessage={setMessage} /></ProtectedRoute>} />
        
        <Route path="*" element={ <NotFoundPage /> } />

      </Route>
    </Routes>
  );
}

export default App;