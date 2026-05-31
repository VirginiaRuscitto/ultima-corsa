[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iZes9Qfg)
# Exam #N: "Exam Title"
## Student: s353342 RUSCITTO VIRGINIA

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- **POST `/api/sessions`**
  - Request body: `{"username": "mrossi", "password": "marco01"}`
  - Response 201 Created: `{"id": 1, "username": "mrossi", "name": "Marco", "surname": "Rossi"}`
  - Response 401 Unauthorized: `{"message": "Incorrect username or password"}`
- **GET `/api/sessions/current`**
  - Response 200 OK: `{"id": 1, "username": "mrossi", "name": "Marco", "surname": "Rossi"}`
  - Response 401 Unauthorized: `{"error": "Unauthenticated user"}`
- **DELETE `/api/sessions/current`**
  - Response 200 OK: No response body
  - Response 401 Unauthorized: `{"error": "Not authorized"}`
- **GET `/api/network`**
  - Response 200 OK: 
    ```json
        {
          "lines": [
            { "id": 1, "name": "Linea I — Via Appia" }
          ],
          "stations": [
            { "id": 1, "name": "Roma" },
            { "id": 2, "name": "Capua" }
          ],
          "connections": [
            {
              "id": 1,
              "lineId": 1,
              "lineName": "Linea I — Via Appia",
              "stationAId": 1,
              "stationAName": "Roma",
              "stationBId": 2,
              "stationBName": "Capua"
            }
          ]
        }
    ```
  - Response 401 Unauthorized: `{"error": "Not authorized"}`
  - Response 500 Internal Server Error: `{"error": "Cannot load network"}`
- **GET `/api/leaderboard`**
  - Response 200 OK:
    ```json
        [
          { "username": "mrossi", "best_score": 24 },
          { "username": "gbianchi", "best_score": 17 }
        ]
    ```
  - Response 401 Unauthorized: `{"error": "Not authorized"}`
  - Response 500 Internal Server Error: `{"error": "Cannot load leaderboard"}`
- **POST `/api/games`**
  - Request body: None
  - Response 201 Created: 
    ```json
        {
          "gameId": 1,
          "startStation": { "id": 1, "name": "Roma" },
          "endStation":   { "id": 6, "name": "Antiochia" }
        }
    ```
  - Response 401 Unauthorized: `{"error": "Not authorized"}`
  - Response 503 Service Unavailable: `{"error": "Network not ready"}`
  - Response 500 Internal Server Error: `{"error": "Cannot create game"}`
- **POST `/api/games/:id/route`**
  - Request body: `{"connectionIds": [1, 2, 3, 4, 5]}`
  - Response 200 OK (valid route):
```json
    {
      "valid": true,
      "segments": [
        {
          "from": "Roma",
          "to": "Capua",
          "eventDescription": "Trovi una moneta d'oro sul pavimento del vagone",
          "coinEffect": 1,
          "coinsAfter": 21
        },
        {
          "from": "Capua",
          "to": "Benevento",
          "eventDescription": "Guasto a una porta del convoglio: partenza ritardata",
          "coinEffect": -2,
          "coinsAfter": 19
        },
        {
          "from": "Benevento",
          "to": "Brindisi",
          "eventDescription": "Viaggio tranquillo, niente di particolare",
          "coinEffect": 0,
          "coinsAfter": 19
        },
        {
          "from": "Brindisi",
          "to": "Corinto",
          "eventDescription": "Un senatore in viaggio assegna una corsia preferenziale al convoglio",
          "coinEffect": 3,
          "coinsAfter": 22
        },
        {
          "from": "Corinto",
          "to": "Antiochia",
          "eventDescription": "Un acquedotto in manutenzione rallenta il traffico ferroviario",
          "coinEffect": -3,
          "coinsAfter": 19
        }
      ],
      "finalScore": 19
    }
```
  - Response 200 OK (invalid route): `{"valid": false, "segments": [], "finalScore": 0}`
  - Response 400 Bad Request: `{"errors": [{"msg": "connectionIds must be a non-empty array"}]}`
  - Response 401 Unauthorized: `{"error": "Not authorized"}`
  - Response 404 Not Found: `{"error": "Game not found"}`
  - Response 409 Conflict: `{"error": "Game already finalized"}`
  - Response 500 Internal Server Error: `{"error": "Cannot process route"}`

## Database Tables

- Table `users` - (id (PK), username (UNIQUE), name, surname, salt, password)
- Table `stations` - (id (PK), name (UNIQUE))
- Table `lines` - (id (PK), name (UNIQUE))
- Table `connections` - (id (PK), line_id (FK -> lines.id), station_a_id (FK -> stations.id), station_b_id (FK -> stations.id))
- Table `events` - (id (PK), description, effect)
- Table `games` - (id (PK), user_id (FK -> users.id), start_station_id (FK -> stations.id), end_station_id (FK -> stations.id), final_score, played_at)

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

| Nome   | Cognome | Username | Password     | Info     |
|:------:|:--------:|:--------:|:------------:|:------------:|
| Marco  | Rossi    | mrossi   | marco01  | |
| Giulia | Bianchi  | gbianchi | giulia01    | |
| Luca   | Verdi    | lverdi   | luca01    | |

## Use of AI Tools
Briefly describe whether you used any AI tools (e.g., ChatGPT, GitHub Copilot, Claude) while working on this project, for which purposes (e.g., clarifying concepts, debugging, generating code), and how you verified or adapted their output.
If you did not use any AI tools, simply state so.
