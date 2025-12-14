# Backend - Gestor de Rutinas de Gimnasio

API RESTful con FastAPI + SQLModel + PostgreSQL para rutinas y ejercicios. Incluye paginación, filtros, duplicado, export CSV/PDF y estadísticas.

## Requisitos
- Python 3.10+ (probado en 3.12)
- PostgreSQL en ejecución

## Instalación
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## Configuración (.env)
En `backend/.env` define tu conexión (psycopg3):
```
DATABASE_URL=postgresql+psycopg://usuario:password@localhost:5433/gym_routines
```
Formato: `postgresql+psycopg://<user>:<pass>@<host>:<port>/<db>`. Si no defines `.env`, se usa el default `postgresql+psycopg://postgres:postgres@localhost:5432/gym_routines`.

Crear la base (ejemplo):
```sql
CREATE DATABASE gym_routines;
```

## Ejecución
```bash
cd backend
.\.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
Docs: http://localhost:8000/docs — Redoc: http://localhost:8000/redoc  
Health: http://localhost:8000/health

## Endpoints principales
- `GET /api/rutinas` listado con filtros `nombre`, `dia`, paginación `page`, `size` (6 por defecto).
- `GET /api/rutinas/{id}` detalle con ejercicios.
- `POST /api/rutinas` crea rutina con ejercicios anidados (valida nombre único).
- `PUT /api/rutinas/{id}` sincroniza rutina y ejercicios (actualiza, agrega, elimina omitidos).
- `DELETE /api/rutinas/{id}` elimina rutina (cascada de ejercicios).
- `GET /api/rutinas/buscar?nombre=&dia=` búsqueda puntual.
- `POST /api/rutinas/{id}/duplicar` clona una rutina ajustando el nombre.
- `GET /api/rutinas/stats` totales, promedio, top por ejercicios y ejercicios por día.
- `GET /api/rutinas/export?format=csv|pdf` exporta rutinas+ejercicios.
- Ejercicios opcionales:
  - `POST /api/rutinas/{id}/ejercicios`
  - `PUT /api/ejercicios/{id}`
  - `DELETE /api/ejercicios/{id}`

## Estructura
```
backend/
├─ app/
│  ├─ main.py        # app, CORS, routers, init_db, health
│  ├─ config.py      # settings (.env) con DATABASE_URL
│  ├─ database.py    # engine y Session
│  ├─ models.py      # SQLModel: Routine, Exercise, enum DayOfWeek
│  ├─ schemas.py     # Pydantic/SQLModel DTOs (create/read/update + paginación)
│  └─ routers/
│     ├─ routines.py   # CRUD, filtros, paginación, stats, export, duplicar
│     └─ exercises.py  # endpoints opcionales de ejercicios
├─ requirements.txt
└─ README.md
```

## Notas / validaciones
- Nombre de rutina único.
- Series y repeticiones > 0; peso > 0 si se envía; orden >= 0.
- Día limitado a: Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo.
- Cascada `all, delete-orphan`: borrar una rutina borra sus ejercicios.


