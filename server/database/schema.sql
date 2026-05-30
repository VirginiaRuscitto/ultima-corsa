DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS lines;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    salt TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    effect INTEGER NOT NULL,
    CHECK (effect BETWEEN -4 AND 4)
);

CREATE TABLE games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    start_station_id INTEGER NOT NULL,
    end_station_id INTEGER NOT NULL,
    final_score INTEGER,
    played_at TEXT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (start_station_id) REFERENCES stations(id),
    FOREIGN KEY (end_station_id) REFERENCES stations(id),

    CHECK (start_station_id <> end_station_id),
    CHECK (final_score >= 0)
);

CREATE TABLE connections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_id INTEGER NOT NULL,
    station_a_id INTEGER NOT NULL,
    station_b_id INTEGER NOT NULL,

    FOREIGN KEY (line_id) REFERENCES lines(id),
    FOREIGN KEY (station_a_id) REFERENCES stations(id),
    FOREIGN KEY (station_b_id) REFERENCES stations(id),

    UNIQUE (line_id, station_a_id, station_b_id),

    CHECK (station_a_id < station_b_id)
);