// imports
import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";
import { body, param, validationResult } from "express-validator";
import dayjs from "dayjs";

import NetworkDAO from "./dao/network-dao.js";
import GameDAO from "./dao/game-dao.js";
import UsersDAO from "./dao/users-dao.js";
import OthersDAO from "./dao/others-dao.js";

import graph from "./utils/graph.js";

// init express
const app = express();
const port = 3001;
app.use(express.json());
app.use(morgan("dev"));

const networkDAO = new NetworkDAO();
const gameDAO = new GameDAO();
const usersDAO = new UsersDAO();
const othersDAO = new OthersDAO();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

let cachedGraph = null;
let cachedConnections = null;
let cachedValidPairs = null;
let cachedStations = null;

async function initNetwork() {
  try {
    const [stations, connections] = await Promise.all([
      networkDAO.getAllStations(),
      networkDAO.getAllConnections(),
    ]);

    cachedConnections = connections;
    cachedStations = stations;
    cachedGraph = graph.buildGraph(connections);

    const stationMap = new Map(stations.map((s) => [s.id, s])); //per evitare il find O(n) dopo per trovare l'id

    const pairs = [];
    for (const station of stations) {
      const distances = graph.allDistancesFrom(cachedGraph, station.id);
      for (const [targetId, dist] of distances) {
        if (dist >= 3 && targetId > station.id)
          pairs.push([station, stationMap.get(targetId)]);
      }
    }

    cachedValidPairs = pairs;
    console.log(`Network loaded`);
  } catch (err) {
    console.error("initNetwork failed:", err);
    cachedStations = [];
    cachedConnections = [];
    cachedValidPairs = [];
  }
}

//PASSPORT
passport.use(
  new LocalStrategy(function verify(username, password, callback) {
    usersDAO
      .getUserByCredentials(username, password)
      .then((user) => {
        if (!user)
          return callback(null, false, {
            message: "Incorrect username or password",
          });
        return callback(null, user);
      })
      .catch((err) => {
        return callback(err);
      });
  }),
);

passport.serializeUser((user, cb) => cb(null, user));

passport.deserializeUser((user, cb) => cb(null, user));

app.use(
  session({
    secret: "ultima-corsa-secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.authenticate("session"));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: "Not authorized" });
};

//API

//session
app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  res.status(201).json(req.user);
});

app.delete("/api/sessions/current", isLoggedIn, (req, res) => {
  req.logout(() => res.sendStatus(204));
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user);
  return res.status(401).json({ error: "Unauthenticated user" });
});

//network
app.get("/api/network", isLoggedIn, async (req, res) => {
  if (!cachedConnections) {
    return res.status(500).json({ error: "Cannot load network" });
  }
  res.json({
    connections: cachedConnections.map((c) => ({
      //tolgo le linee
      id: c.id,
      stationAId: c.stationAId,
      stationAName: c.stationAName,
      stationBId: c.stationBId,
      stationBName: c.stationBName,
    })),
  });
});

//leaderboard
app.get("/api/leaderboard", isLoggedIn, async (req, res) => {
  try {
    const leaderboard = await othersDAO.getLeaderboard();
    const formatted = leaderboard.map((l) => ({
      ...l,
      date: dayjs(l.bestPlayedAt).format("DD/MM/YYYY HH:mm"),
    }));

    res.json(formatted);
  } catch {
    res.status(500).json({ error: "Cannot load leaderboard" });
  }
});

//game
app.post("/api/games", isLoggedIn, async (req, res) => {
  try {
    if (!cachedValidPairs?.length) {
      return res.status(503).json({ error: "Network not ready" });
    }
    const [s, e] =
      cachedValidPairs[Math.floor(Math.random() * cachedValidPairs.length)];
    const [start, end] = Math.random() < 0.5 ? [s, e] : [e, s]; //randomizzare l'ordine di start e end
    const time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const gameId = await gameDAO.createGame(
      req.user.id,
      start.id,
      end.id,
      time,
    );
    res.status(201).json({
      id: gameId,
      startStation: { id: start.id, name: start.name },
      endStation: { id: end.id, name: end.name },
      playedAt: time,
    });
  } catch {
    res.status(500).json({ error: "Cannot create game" });
  }
});

app.get(
  "/api/games/:id",
  isLoggedIn,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("Game id must be a positive integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid data" });
    }

    try {
      const game = await gameDAO.getGame(Number(req.params.id), req.user.id);
      if (!game) return res.status(404).json({ error: "Game not found" });

      res.json({
        id: game.id,
        startStation: { id: game.startStationId, name: game.startStationName },
        endStation: { id: game.endStationId, name: game.endStationName },
        finalScore: game.finalScore,
        playedAt: game.playedAt.format("YYYY-MM-DD HH:mm:ss"),
      });
    } catch {
      res.status(500).json({ error: "Cannot load game" });
    }
  },
);

app.post(
  "/api/games/:id/route",
  isLoggedIn,
  [
    param("id")
      .isInt({ min: 1 })
      .withMessage("Game id must be a positive integer"),
    body("connectionIds")
      .isArray()
      .withMessage("connectionIds must be an array"),
    body("connectionIds.*")
      .isInt({ min: 1 })
      .withMessage("Each connection id must be a positive integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const gameId = Number(req.params.id);
    const { connectionIds } = req.body;

    try {
      const game = await gameDAO.getGame(gameId, req.user.id);
      if (!game) return res.status(404).json({ error: "Game not found" });

      if (game.finalScore !== null)
        return res.status(409).json({ error: "Game already finalized" });

      const PLANNING_DURATION_MS = 95 * 1000; //per tollerare ritardi nella rete
      const elapsed = dayjs().diff(game.playedAt);
      console.log(
        "elapsed ms:",
        elapsed,
        "| played_at:",
        game.playedAt,
        "| now:",
        dayjs().format("YYYY-MM-DD HH:mm:ss"),
      );
      if (elapsed > PLANNING_DURATION_MS) {
        await gameDAO.finalizeGame(gameId, req.user.id, 0);
        return res.json({
          valid: false,
          reason: "time_expired",
          segments: [],
          finalScore: 0,
        });
      }

      if (connectionIds.length < 3) {
        await gameDAO.finalizeGame(gameId, req.user.id, 0);
        return res.json({
          valid: false,
          reason: "too_short",
          segments: [],
          finalScore: 0,
        });
      }

      const orderedPath = graph.validateOrderedPath(
        connectionIds,
        cachedConnections,
        game.startStationId,
        game.endStationId,
      );

      if (!orderedPath) {
        await gameDAO.finalizeGame(gameId, req.user.id, 0);
        return res.json({
          valid: false,
          reason: "invalid_path",
          segments: [],
          finalScore: 0,
        });
      }

      const stationMap = new Map(cachedStations.map((s) => [s.id, s.name]));
      const connMap = new Map(cachedConnections.map((c) => [c.id, c]));

      const allEvents = await othersDAO.getAllEvents();
      let coins = 20;
      const segments = [];
      for (const { from, to, connId } of orderedPath) {
        const conn = connMap.get(connId);
        const event = allEvents[Math.floor(Math.random() * allEvents.length)];
        coins += event.effect;
        segments.push({
          from: stationMap.get(from),
          to: stationMap.get(to),
          lineName: conn.lineName,
          eventDescription: event.description,
          coinEffect: event.effect,
          coinsAfter: coins,
        });
      }

      if (coins < 0) coins = 0;

      await gameDAO.finalizeGame(gameId, req.user.id, coins);
      res.json({ valid: true, segments, finalScore: coins });
    } catch {
      res.status(500).json({ error: "Cannot process route" });
    }
  },
);

// activate the server
initNetwork().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});
