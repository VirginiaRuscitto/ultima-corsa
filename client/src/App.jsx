import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import DefaultLayout from "./layout/DefaultLayout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InstructionsPage from "./pages/InstructionsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import GamePage from "./pages/GamePage";
import SetupPage from "./pages/SetupPage";
import NotFoundPage from "./pages/NotFoundPage";
import API from "../API.js";

import MessageContext from "./MessageContext";

function ProtectedRoute({ loggedIn, children }) {
  const location = useLocation();
  if (!loggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }
  return children;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const navigate = useNavigate();

  const messageContextValue = { message, setMessage };

  useEffect(() => {
    API.getSession()
      .then((u) => {
        setLoggedIn(true);
        setUser(u);
      })
      .catch(() => {})
      .finally(() => setInitializing(false));
  }, []);

  function handleLogin(credentials) {
    return API.login(credentials).then((u) => {
      //catch non serve perchè gestisco in login
      setLoggedIn(true);
      setUser(u);
    });
  }

  function handleLogout() {
    API.logout()
      .catch(() => {})
      .finally(() => {
        setLoggedIn(false);
        setUser(null);
        setMessage(null);
        navigate("/");
      });
  }

  return (
    <MessageContext.Provider value={messageContextValue}>
    {initializing ? (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white" style={{ zIndex: 9999 }}>
        <Spinner animation="border" />
      </div>
    ) : (
      <Routes>
        <Route
          element={
            <DefaultLayout
              loggedIn={loggedIn}
              user={user}
              handleLogout={handleLogout}
            />
          }
        >
          <Route index element={<HomePage loggedIn={loggedIn} />} />

          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate replace to="/" />
              ) : (
                <LoginPage handleLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/instructions"
            element={<InstructionsPage loggedIn={loggedIn} />}
          />

          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <LeaderboardPage user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/game"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <SetupPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/game/:id"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <GamePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    )}
    </MessageContext.Provider>
  );
}

export default App;
