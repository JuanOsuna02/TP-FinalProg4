-- Crear tipos y tablas para rutinas y ejercicios
CREATE TYPE day_of_week_type AS ENUM ('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo');

CREATE TABLE routine (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE exercise (
  id SERIAL PRIMARY KEY,
  routine_id INTEGER NOT NULL REFERENCES routine(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  day day_of_week_type NOT NULL,
  series INTEGER NOT NULL CHECK (series > 0),
  repetitions INTEGER NOT NULL CHECK (repetitions > 0),
  weight NUMERIC(10,2) CHECK (weight > 0),
  notes TEXT,
  "order" INTEGER NOT NULL DEFAULT 0 CHECK ("order" >= 0)
);

CREATE INDEX idx_exercise_routine_id ON exercise(routine_id);
CREATE INDEX idx_exercise_day ON exercise(day);

