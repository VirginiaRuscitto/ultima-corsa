import db from "../database/db.mjs";
import { Game } from './models.mjs';
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

    this.finalizeGame = (gameId, userId, finalScore) => {
        return new Promise((resolve, reject) => {
            //ci si accerta bene che la partita che sto modificando sia effettivamente quella corretta
            const query = `
                UPDATE games
                SET final_score = ?
                WHERE id = ? AND user_id = ? AND final_score=0
            `;

            db.run(query, [finalScore, gameId, userId], function(err) {
                if (err) reject(err);
                else if (this.changes === 0) {
                    reject(new Error('Game not found or already finalized'));
                } else {
                    resolve();
                }
            });
        });
    };
}