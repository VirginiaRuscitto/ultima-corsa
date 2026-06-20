import { Station, Connection, User } from "./models.js";

const SERVER_URL = "http://localhost:3001";

const handleResponse = async (response) => {
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const err = new Error(
      data?.error || data?.message || response.statusText || "Unknown error",
    );
    err.status = response.status;
    err.details = data;
    throw err;
  }
  return data;
};

//auth
const getSession = async () => {
  const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
    credentials: "include",
  });

  const data = await handleResponse(response);

  return new User(data.id, data.username, data.name, data.surname);
};

const login = async (credentials) => {
  const response = await fetch(`${SERVER_URL}/api/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const user = await handleResponse(response);

  return new User(user.id, user.username, user.name, user.surname);
};

const logout = async () => {
  const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
    method: "DELETE",
    credentials: "include",
  });

  return await handleResponse(response);
};

//network
const getNetwork = async () => {
  const response = await fetch(`${SERVER_URL}/api/network`, {
    credentials: "include",
  });

  const data = await handleResponse(response);

  return {
    connections: data.connections.map(
      (c) =>
        new Connection(
          c.id,
          c.stationAId,
          c.stationAName,
          c.stationBId,
          c.stationBName,
        ),
    ),
  };
};

//games
const createGame = async () => {
  const response = await fetch(`${SERVER_URL}/api/games`, {
    method: "POST",
    credentials: "include",
  });

  return await handleResponse(response);
};

const getGame = async (gameId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}`, {
    credentials: "include",
  });

  return await handleResponse(response);
};

const submitRoute = async (gameId, connectionIds) => {
  const response = await fetch(`${SERVER_URL}/api/games/${gameId}/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ connectionIds }),
  });

  return await handleResponse(response);
};

//leaderboard
const getLeaderboard = async () => {
  const response = await fetch(`${SERVER_URL}/api/leaderboard`, {
    credentials: "include",
  });

  return await handleResponse(response);
};

const API = {
  getSession,
  login,
  logout,
  getNetwork,
  createGame,
  submitRoute,
  getLeaderboard,
  getGame,
};
export default API;
