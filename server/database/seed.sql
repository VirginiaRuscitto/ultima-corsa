BEGIN TRANSACTION;

-- STATIONS
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
('Linea IV — Via Marittima'),
('Linea V — Via Danubiana');

-- EVENTS
INSERT INTO events (description, effect) VALUES
('Un console ubriaco improvvisa un brindisi sul convoglio: i passeggeri vengono premiati generosamente', 4),
('Un senatore in viaggio assegna una corsia preferenziale al convoglio e ne favorisce il passaggio lungo la tratta', 3),
('Un tempio vicino alla linea è in festa: il traffico lungo la tratta è più fluido', 2),
('Trovi un posto a sedere libero', 1),
('Trovi una moneta d’oro sul pavimento del vagone', 1),
('Un carro cerimoniale imperiale si incastra nei binari del convoglio bloccando completamente la tratta', -4),
('Un acquedotto in manutenzione rallenta il traffico ferroviario', -3),
('Guasto a una porta del convoglio: partenza ritardata', -2),
('Convoglio particolarmente affollato', -1),
('Hai scelto la carrozza più rumorosa', -1),
('Controllo ordinario dei biglietti', 0),
('Viaggio tranquillo, niente di particolare', 0);

-- CONNECTIONS

-- LINEA I — Via Appia
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Roma'
JOIN stations b ON b.name = 'Capua'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Capua'
JOIN stations b ON b.name = 'Benevento'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Benevento'
JOIN stations b ON b.name = 'Brindisi'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Brindisi'
JOIN stations b ON b.name = 'Corinto'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Corinto'
JOIN stations b ON b.name = 'Antiochia'
WHERE l.name = 'Linea I — Via Appia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Antiochia'
JOIN stations b ON b.name = 'Alessandria d’Egitto'
WHERE l.name = 'Linea I — Via Appia';

-- LINEA II — Via Aurelia
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Londra'
JOIN stations b ON b.name = 'Lione'
WHERE l.name = 'Linea II — Via Aurelia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Lione'
JOIN stations b ON b.name = 'Marsiglia'
WHERE l.name = 'Linea II — Via Aurelia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Marsiglia'
JOIN stations b ON b.name = 'Roma'
WHERE l.name = 'Linea II — Via Aurelia';

-- LINEA III — Via Emilia
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Torino'
JOIN stations b ON b.name = 'Milano'
WHERE l.name = 'Linea III — Via Emilia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Milano'
JOIN stations b ON b.name = 'Rimini'
WHERE l.name = 'Linea III — Via Emilia';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Rimini'
JOIN stations b ON b.name = 'Capua'
WHERE l.name = 'Linea III — Via Emilia';

-- LINEA IV — Via Marittima
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Roma'
JOIN stations b ON b.name = 'Cartagine'
WHERE l.name = 'Linea IV — Via Marittima';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Cartagine'
JOIN stations b ON b.name = 'Cadice'
WHERE l.name = 'Linea IV — Via Marittima';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Cadice'
JOIN stations b ON b.name = 'Tarragona'
WHERE l.name = 'Linea IV — Via Marittima';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Tarragona'
JOIN stations b ON b.name = 'Marsiglia'
WHERE l.name = 'Linea IV — Via Marittima';

-- LINEA V — Via Danubiana
INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Milano'
JOIN stations b ON b.name = 'Aquileia'
WHERE l.name = 'Linea V — Via Danubiana';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Aquileia'
JOIN stations b ON b.name = 'Sirmio'
WHERE l.name = 'Linea V — Via Danubiana';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Sirmio'
JOIN stations b ON b.name = 'Niš'
WHERE l.name = 'Linea V — Via Danubiana';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Niš'
JOIN stations b ON b.name = 'Bisanzio'
WHERE l.name = 'Linea V — Via Danubiana';

INSERT INTO connections (line_id, station_a_id, station_b_id)
SELECT l.id, LEAST(a.id, b.id), GREATEST(a.id, b.id)
FROM lines l
JOIN stations a ON a.name = 'Bisanzio'
JOIN stations b ON b.name = 'Antiochia'
WHERE l.name = 'Linea V — Via Danubiana';

COMMIT;