import db from "../database/db.mjs";
import { Game } from '../models.mjs';
import dayjs from 'dayjs';

export default function GameDAO(){

    this.createGame = (userId, startStationId, endStationId, playedAt) => {
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO games (user_id, start_station_id, end_station_id, played_at)
                VALUES (?, ?, ?, ?)
            `;

            db.run(query, [userId, startStationId, endStationId, playedAt], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });
    };

    this.getGame = (gameId, userId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT g.id, g.user_id, g.start_station_id, g.end_station_id,
                    g.final_score, g.played_at,
                    sa.name AS start_station_name, sb.name AS end_station_name
                FROM games g
                JOIN stations sa ON sa.id = g.start_station_id
                JOIN stations sb ON sb.id = g.end_station_id
                WHERE g.id = ? AND g.user_id = ?
            `;
            db.get(query, [gameId, userId], (err, row) => {
                if (err) reject(err);
                else if (!row) resolve(null);
                else resolve(new Game(row.id, row.user_id, row.start_station_id, row.start_station_name,
                    row.end_station_id, row.end_station_name, row.final_score, row.played_at));
            });
        });
    };

    this.finalizeGame = (gameId, userId, finalScore) => {
        return new Promise((resolve, reject) => {
            //ci si accerta bene che la partita che sto modificando sia effettivamente quella corretta
            const query = `
                UPDATE games
                SET final_score = ?
                WHERE id = ? AND user_id = ? AND final_score IS NULL
            `;

            db.run(query, [finalScore, gameId, userId], function(err) {
                if (err) reject(err);
                else resolve();
            });
        });
    };
}