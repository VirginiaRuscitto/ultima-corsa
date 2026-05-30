import db from "../database/db.mjs";
import { Station, Line, Connection } from './models.mjs';

export default function NetworkDAO() {

    this.getAllStations = () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, name FROM stations', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => new Station(r.id, r.name)));
            });
        });
    };

    this.getAllLines = () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT id, name FROM lines', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => new Line(r.id, r.name)));
            });
        });
    };

    this.getAllConnections = () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.id, c.line_id, l.name AS line_name,
                       c.station_a_id, sa.name AS station_a_name,
                       c.station_b_id, sb.name AS station_b_name
                FROM connections c
                JOIN lines l ON l.id = c.line_id
                JOIN stations sa ON sa.id = c.station_a_id
                JOIN stations sb ON sb.id = c.station_b_id
                ORDER BY l.name, c.id
            `;
            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r =>
                    new Connection(r.id, r.line_id, r.line_name,
                        r.station_a_id, r.station_a_name,
                        r.station_b_id, r.station_b_name)
                ));
            });
        });
    };
}