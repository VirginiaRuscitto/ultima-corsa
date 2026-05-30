import sqlite3 from 'sqlite3';

const db = new sqlite.Database('database.db', (err) => { 
    if (err){
      console.error('Failed to connect to database: ', err);
      throw err;
    }
    console.log('Connected to database');
});

export default db;