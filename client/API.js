import { Station, Line, Connection, Game, User } from "./models.mjs";

const SERVER_URL = "http://localhost:3001";


const handleResponse = async (response) => {
    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const err = new Error(data?.error || response.statusText || "Unknown error");
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
        stations: data.stations.map((s) => new Station(s.id, s.name)),
        lines: data.lines.map((l) => new Line(l.id, l.name)),
        connections: data.connections.map(
            (c) =>
                new Connection(
                    c.id,
                    c.lineId,
                    c.lineName,
                    c.stationAId,
                    c.stationAName,
                    c.stationBId,
                    c.stationBName
                )
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

const submitRoute = async (gameId, connectionIds) => {
    const response = await fetch(`${SERVER_URL}/api/games/${gameId}/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ connectionIds }),
    });

    const data = await handleResponse(response);

    if (data.valid === false) {
        throw new Error("Invalid route");
    }

    return data;
};

//leaderboard
const getLeaderboard = async () => {
    const response = await fetch(`${SERVER_URL}/api/leaderboard`, {
        credentials: "include",
    });

    return await handleResponse(response);
};

const API = {getSession, login, logout, getNetwork, createGame, submitRoute, getLeaderboard};
export default API;