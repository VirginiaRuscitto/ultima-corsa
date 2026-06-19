import db from "../database/db.js";
import { Event } from "../models.js";

export default function OthersDAO() {
  this.getLeaderboard = () => {
    return new Promise((resolve, reject) => {
      const query = `
                SELECT 
                    u.username AS username,
                    g.final_score AS bestScore,
                    g.played_at AS bestPlayedAt
                FROM users u
                JOIN games g ON g.user_id = u.id
                WHERE g.id = (
                    SELECT g2.id
                    FROM games g2
                    WHERE g2.user_id = u.id AND g2.final_score IS NOT NULL
                    ORDER BY g2.final_score DESC, g2.played_at DESC
                    LIMIT 1
                )
                ORDER BY bestScore DESC
            `;
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  };

  this.getAllEvents = () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT id, description, effect FROM events", [], (err, rows) => {
        if (err) reject(err);
        else if (!rows.length) reject(new Error("No events found"));
        else resolve(rows.map((r) => new Event(r.id, r.description, r.effect)));
      });
    });
  };
}
