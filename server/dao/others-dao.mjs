import db from "../database/db.mjs";
import { Event } from '../models.mjs';

export default function OthersDAO() {
    this.getLeaderboard = () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.id, u.username, MAX(g.final_score) AS best_score
                FROM games g
                JOIN users u ON u.id = g.user_id
                WHERE g.final_score IS NOT NULL
                GROUP BY g.user_id
                ORDER BY best_score DESC
            `;
            db.all(query, [], (err, rows) => {
                if (err) reject(err); 
                else resolve(rows);
            });
        });
    };

    this.getRandomEvent = () => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, description, effect FROM events ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
                if (err) reject(err);
                else if (!row) reject(new Error('No events found'));
                else resolve(new Event(row.id, row.description, row.effect));
            });
        });
    };
}