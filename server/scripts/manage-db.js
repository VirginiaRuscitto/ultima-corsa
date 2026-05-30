import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../database/database.db');
const SCHEMA_PATH = path.join(__dirname, '../database/schema.sql');
const SEED_PATH = path.join(__dirname, '../database/seed.sql');

const command = process.argv[2];

function executeSqlFile(dbPath, sqlPath) {
  return new Promise((resolve, reject) => {
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
    });

    db.exec(sql, (err) => {
      db.close();

      if (err) reject(err);
      else resolve();
    });
  });
}

async function rebuild() {
  if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
  }

  await executeSqlFile(DB_PATH, SCHEMA_PATH);

  if (fs.existsSync(SEED_PATH)) {
    const seedContent = fs.readFileSync(SEED_PATH, 'utf8').trim();

    if (seedContent.length > 0) {
      await executeSqlFile(DB_PATH, SEED_PATH);
    }
  }

  console.log('Database rebuilt');
}

async function seed() {
  if (!fs.existsSync(DB_PATH)) {
    console.log('Database not found. Run rebuild first.');
    return;
  }

  await executeSqlFile(DB_PATH, SEED_PATH);

  console.log('Seed completed');
}

function clearGames() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH);

    db.serialize(() => {
      db.run('DELETE FROM games');

      db.run(
        "DELETE FROM sqlite_sequence WHERE name='games'",
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          db.close();
          resolve();
        }
      );
    });
  });
}

async function main() {
  try {
    switch (command) {
      case 'rebuild':
        await rebuild();
        break;

      case 'seed':
        await seed();
        break;

      case 'clear-games':
        await clearGames();
        console.log('Games cleared');
        break;

      default:
        console.log(`
Usage:

node scripts/manage-db.js rebuild
node scripts/manage-db.js seed
node scripts/manage-db.js clear-games
`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();