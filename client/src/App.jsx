import { Routes, Route, Navigate } from "react-router";
import { useState } from "react";

import DefaultLayout from "./DefaultLayout";

import HomePage from "./pages/HomePage";
import InstructionsPage from "./pages/InstructionsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import GamePage from "./pages/GamePage";
import NotFoundPage from "./pages/NotFoundPage";

function ProtectedRoute({ loggedIn, children }) {
  if (!loggedIn) {
    return <Navigate to="/" replace state={{ error: "Login required" }} />; //TODO fare che manda un mess di errore
  }

  return children;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);


  return (
    <Routes>
      <Route element={<DefaultLayout loggedIn={loggedIn} user={user} message={message} setMessage={setMessage}
        handleLogout={handleLogout} onShowLogin={() => setShowLogin(true)}/>}>
          
        <Route index element={<HomePage />} />

        <Route path="/instructions" element={<InstructionsPage />} />

        <Route path="/leaderboard" element={<ProtectedRoute loggedIn={loggedIn}><LeaderboardPage /></ProtectedRoute>} />

        <Route path="/game/:id" element={<ProtectedRoute loggedIn={loggedIn}><GamePage user={user} /></ProtectedRoute>} />
        
        <Route path="*" element={ <NotFoundPage /> } />
      </Route>
    </Routes>
  );
}

export default App;