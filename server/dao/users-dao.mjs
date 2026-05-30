import db from "../database/db.mjs";
import { User } from './models.mjs';
import crypto from 'crypto';

export default function UsersDAO() {
    this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) reject(err);
                else if (!row) resolve(null);
                else {
                    crypto.scrypt(password, row.salt, 32, (err, hashed) => {
                        if (err) reject(err);
                        else if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashed))
                            resolve(null);
                        else
                            resolve(new User(row.id, row.username, row.name, row.surname));
                    });
                }
            });
        });
    };

    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT id, username, name, surname FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else if (!row) resolve(null);
                else resolve(new User(row.id, row.username, row.name, row.surname));
            });
        });
    };
}