-- Datos de ejemplo para rutinas y ejercicios
INSERT INTO routine (name, description) VALUES
('Fullbody A', 'Rutina general de fuerza'),
('Push/Pull/Legs', 'Dividida en empuje, tirón y piernas'),
('Torso/Pierna', 'Torso y pierna alternados');

-- Fullbody A
INSERT INTO exercise (routine_id, name, day, series, repetitions, weight, notes, "order") VALUES
(1, 'Sentadilla', 'Lunes', 4, 8, 60, 'Profundidad paralela', 1),
(1, 'Press banca', 'Lunes', 4, 8, 50, 'Agarre medio', 2),
(1, 'Remo con barra', 'Lunes', 4, 10, 45, NULL, 3),
(1, 'Press militar', 'Miercoles', 3, 10, 30, NULL, 1),
(1, 'Peso muerto', 'Viernes', 3, 5, 90, 'Espalda neutra', 1);

-- Push/Pull/Legs
INSERT INTO exercise (routine_id, name, day, series, repetitions, weight, notes, "order") VALUES
(2, 'Press banca', 'Lunes', 4, 8, 55, NULL, 1),
(2, 'Fondos', 'Lunes', 3, 10, NULL, 'Al fallo técnico', 2),
(2, 'Press militar', 'Lunes', 3, 10, 32, NULL, 3),
(2, 'Dominadas', 'Miercoles', 4, 8, NULL, 'Supinas', 1),
(2, 'Remo con mancuerna', 'Miercoles', 3, 12, 24, NULL, 2),
(2, 'Facepull', 'Miercoles', 3, 15, 12, NULL, 3),
(2, 'Sentadilla', 'Viernes', 4, 8, 70, NULL, 1),
(2, 'Peso muerto rumano', 'Viernes', 3, 10, 60, NULL, 2),
(2, 'Elevación de talones', 'Viernes', 4, 12, 40, NULL, 3);

-- Torso/Pierna
INSERT INTO exercise (routine_id, name, day, series, repetitions, weight, notes, "order") VALUES
(3, 'Press banca inclinado', 'Lunes', 4, 8, 50, NULL, 1),
(3, 'Remo en polea', 'Lunes', 4, 10, 40, NULL, 2),
(3, 'Facepull', 'Lunes', 3, 15, 15, NULL, 3),
(3, 'Sentadilla frontal', 'Martes', 4, 6, 65, NULL, 1),
(3, 'Prensa', 'Martes', 4, 12, 120, NULL, 2),
(3, 'Curl femoral', 'Martes', 3, 12, 35, NULL, 3);

