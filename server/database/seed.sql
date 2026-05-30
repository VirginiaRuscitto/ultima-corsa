BEGIN TRANSACTION;

--STATIONS
INSERT INTO stations (name) VALUES
('Roma'),
('Capua'),
('Benevento'),
('Brindisi'),
('Corinto'),
('Antiochia'),
('Alessandria d’Egitto'),
('Londra'),
('Lione'),
('Marsiglia'),
('Torino'),
('Milano'),
('Rimini'),
('Cartagine'),
('Cadice'),
('Tarragona'),
('Aquileia'),
('Sirmio'),
('Niš'),
('Bisanzio');

-- LINES
INSERT INTO lines (name) VALUES
('Linea I — Via Appia'),
('Linea II — Via Aurelia'),
('Linea III — Via Emilia'),
('Linea IV — Rotta Occidentale'),
('Linea V — Via Danubiana');

-- EVENTS
INSERT INTO events (description, effect) VALUES
('Ritrovamento di un relitto carico di anfore: ne acquisti il contenuto a prezzo stracciato', 4),
('Un liberto influente ti presenta ai mercanti locali: stringi contatti che valgono oro', 3),
('Fiera stagionale in città: afflusso straordinario di clienti, i prezzi salgono', 2),
('Carovana di pellegrini sulla tua stessa rotta: viaggi insieme ad altri mercanti, dividendo costi e rischi', 1),
('Cambio di prefetto in città: non sono ancora state definite le tariffe doganali, passi senza dazi', 1),
('Rivalità tra due famiglie patrizie blocca il mercato locale: il commercio è paralizzato, nessuno compra né vende', -4),
('Epidemia di febbre nella città di scalo: quarantena obbligata, perdi tempo e parte delle scorte', -3),
('Legionari di passaggio requisiscono parte del carico: parte delle merci viene confiscata per l’Impero', -2),
('Piogge insolitamente abbondanti lungo il tragitto: il viaggio rallenta e alcune merci si rovinano', -1),
('Caldo torrido fuori stagione: parte del carico deperisce durante il trasporto', -1),
('Ispezione amministrativa senza conseguenze: controllo rapido delle merci, tutto risulta in regola', 0),
('Il governatore provinciale impone un calmiere sui prezzi: il mercato si stabilizza, senza guadagni né perdite', 0);

-- CONNECTIONS

-- LINEA I — Via Appia
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Roma'
JOIN stations b ON b.name = 'Capua'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Capua'
JOIN stations b ON b.name = 'Benevento'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Benevento'
JOIN stations b ON b.name = 'Brindisi'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Brindisi'
JOIN stations b ON b.name = 'Corinto'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Corinto'
JOIN stations b ON b.name = 'Antiochia'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Antiochia'
JOIN stations b ON b.name = 'Alessandria d’Egitto'
WHERE l.name = 'Linea I — Via Appia';

-- LINEA II — Via Aurelia
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Londra'
JOIN stations b ON b.name = 'Lione'
WHERE l.name = 'Linea II — Via Aurelia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Lione'
JOIN stations b ON b.name = 'Marsiglia'
WHERE l.name = 'Linea II — Via Aurelia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Marsiglia'
JOIN stations b ON b.name = 'Roma'
WHERE l.name = 'Linea II — Via Aurelia';

-- LINEA III — Via Emilia
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Torino'
JOIN stations b ON b.name = 'Milano'
WHERE l.name = 'Linea III — Via Emilia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Milano'
JOIN stations b ON b.name = 'Rimini'
WHERE l.name = 'Linea III — Via Emilia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Rimini'
JOIN stations b ON b.name = 'Capua'
WHERE l.name = 'Linea III — Via Emilia';

-- LINEA IV — Rotta Occidentale
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Roma'
JOIN stations b ON b.name = 'Cartagine'
WHERE l.name = 'Linea IV — Rotta Occidentale';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Cartagine'
JOIN stations b ON b.name = 'Cadice'
WHERE l.name = 'Linea IV — Rotta Occidentale';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Cadice'
JOIN stations b ON b.name = 'Tarragona'
WHERE l.name = 'Linea IV — Rotta Occidentale';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Tarragona'
JOIN stations b ON b.name = 'Marsiglia'
WHERE l.name = 'Linea IV — Rotta Occidentale';

-- LINEA V — Via Danubiana
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Milano'
JOIN stations b ON b.name = 'Aquileia'
WHERE l.name = 'Linea V — Via Danubiana';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Aquileia'
JOIN stations b ON b.name = 'Sirmio'
WHERE l.name = 'Linea V — Via Danubiana';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Sirmio'
JOIN stations b ON b.name = 'Niš'
WHERE l.name = 'Linea V — Via Danubiana';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Niš'
JOIN stations b ON b.name = 'Bisanzio'
WHERE l.name = 'Linea V — Via Danubiana';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, MIN(a.id, b.id), MAX(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Bisanzio'
JOIN stations b ON b.name = 'Antiochia'
WHERE l.name = 'Linea V — Via Danubiana';

COMMIT;