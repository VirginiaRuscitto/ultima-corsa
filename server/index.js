// imports
import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import { body, param, validationResult } from 'express-validator';
import dayjs from 'dayjs';

import NetworkDAO from './dao/network-dao.mjs';
import GameDAO from './dao/game-dao.mjs';
import UsersDAO from './dao/users-dao.mjs';
import OthersDAO from './dao/others-dao.mjs';

import graph from './utils/graph.mjs';

// init express
const app = express();
const port = 3001;
app.use(express.json());
app.use(morgan('dev'));

const networkDAO=new NetworkDAO();
const gameDAO=new GameDAO();
const usersDAO=new UsersDAO();
const othersDAO=new OthersDAO();

const corsOptions={
  origin: 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

let cachedGraph=null;
let cachedConnections=null;
let cachedValidPairs=null;
let cachedStations = null;
let cachedLines = null;

async function initNetwork() {
  try{
    const [stations, connections, lines]=await Promise.all([networkDAO.getAllStations(), networkDAO.getAllConnections(), networkDAO.getAllLines()]);

    cachedConnections=connections;
    cachedLines = lines;
    cachedStations = stations;
    cachedGraph=graph.buildGraph(connections);

    const stationMap = new Map(stations.map(s => [s.id, s])); //per evitare il find O(n) dopo petr trovare l'id

    const pairs=[];
    for (const station of stations) {
      const distances=graph.allDistancesFrom(cachedGraph, station.id);
        for (const [targetId, dist] of distances) {
          if (dist>=3 && targetId>station.id)
            pairs.push([station, stationMap.get(targetId)]);
        }
    }

    cachedValidPairs=pairs;
    console.log(`Network loaded`);
  } catch (err) {
    console.error("initNetwork failed:", err);
    cachedStations = [];
    cachedLines = [];
    cachedConnections = [];
    cachedValidPairs = [];
  }
}

//PASSPORT
passport.use(
  new LocalStrategy(function verify(username, password, callback) {
    usersDAO.getUserByCredentials(username, password).then((user) => {
      if (!user)
        return callback(null, false, {message:'Incorrect username or password'});
      return callback(null, user);
    }).catch((err) => { //nel caso in cui ci sia un errore nel db TODO è corretto?
      return callback(err);
    });
  })
);

passport.serializeUser((user, cb) => cb(null, user)); //TODO nel caso mando solo l'id  

passport.deserializeUser((user, cb) => cb(null, user));

app.use(session({
  secret: 'ultima-corsa-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.authenticate('session'));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Not authorized' });
};

//API

//session
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.status(201).json(req.user);
});

app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  req.logout(() => res.end());
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) return res.json(req.user);
  return res.status(401).json({ error: 'Unauthenticated user' });
});

//network
app.get('/api/network', isLoggedIn, async (req, res) => {
  try {
    res.json({ stations: cachedStations, lines: cachedLines, connections: cachedConnections }); //TODO servono davvero tutte per il frontend? rivedere una volta che faccio il frontend
  } catch {
    res.status(500).json({ error: 'Cannot load network' });
  }
});

//leaderboard
app.get('/api/leaderboard', isLoggedIn, async (req, res) => {
  try {
    const leaderboard = await othersDAO.getLeaderboard();
    res.json(leaderboard);
  } catch {
    res.status(500).json({ error: 'Cannot load leaderboard' });
  }
});

//game
app.post('/api/games', isLoggedIn, async (req, res) => {
  try {
      if (!cachedValidPairs?.length) {
        return res.status(503).json({ error: 'Network not ready' });
      }
    const [start, end]=cachedValidPairs[Math.floor(Math.random()*cachedValidPairs.length)];
    const gameId=await gameDAO.createGame(req.user.id, start.id, end.id, dayjs().format('YYYY-MM-DD HH:mm:ss'));
    res.status(201).json({gameId, startStation: { id: start.id, name: start.name }, endStation: { id: end.id, name: end.name }});
  } catch {
    res.status(500).json({ error: 'Cannot create game' });
  }
});

app.post(
  '/api/games/:id/route', //TODO in caso la splitto in validate e in resolve
  isLoggedIn,
  [
    param('id').isInt({ min: 1 }).withMessage('Game id must be a positive integer'),
    body('connectionIds').isArray({ min: 1 }).withMessage('connectionIds must be a non-empty array'),
    body('connectionIds.*').isInt({ min: 1 }).withMessage('Each connection id must be a positive integer'),
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const gameId=Number(req.params.id);
    const { connectionIds }=req.body;

    try {
      const game=await gameDAO.getGame(gameId, req.user.id);
      if (!game)
        return res.status(404).json({ error: 'Game not found' });

      if (game.finalScore !== null)
        return res.status(409).json({ error: 'Game already finalized' });

      const isValid = graph.validateRoute(connectionIds, cachedConnections, game.startStationId, game.endStationId);
      if (!isValid) {
        await gameDAO.finalizeGame(gameId, req.user.id, 0);
        return res.json({valid: false, segments: [], finalScore: 0});
      }

      //sennò faccio il calcolo di tutte le tratte del gioco
      const connMap=new Map(cachedConnections.map(c => [c.id, c]));
      let coins=20;
      const segments=[];

      for (const connId of connectionIds) {
        const conn=connMap.get(connId);

        const event = await othersDAO.getRandomEvent();
        coins = coins + event.effect;

        segments.push({
          from: conn.stationAName,
          to: conn.stationBName,
          eventDescription: event.description,
          coinEffect: event.effect,
          coinsAfter: coins
        });
      }

      if (coins < 0) coins = 0;

      await gameDAO.finalizeGame(gameId, req.user.id, coins);
      res.json({valid: true, segments, finalScore: coins});
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Cannot process route'
      });
    }
  }
);

// activate the server
initNetwork().then(() => {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
});