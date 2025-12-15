# Gestor de Rutinas de Gimnasio

Proyecto fullstack: FastAPI + SQLModel + PostgreSQL en el backend y React 18 + Vite + Chakra UI en el frontend. Incluye CRUD de rutinas y ejercicios, paginación (6 por página), estadísticas, duplicado, export CSV/PDF, calendario semanal y drag & drop en el formulario.

## Requisitos
- Python 3.10+ (probado en 3.12)
- Node.js 18+
- PostgreSQL en ejecución

## Estructura
```
/backend      # API FastAPI, modelos SQLModel, routers, scripts SQL
/frontend     # SPA React/Vite/Chakra
```

## Configuración rápida
Backend:
1. `cd backend`
2. `python -m venv .venv`
3. `.\.venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. Crear `backend/.env` con `DATABASE_URL=postgresql+psycopg://user:pass@localhost:5433/gym_routines`
6. Levantar: `uvicorn app.main:app --reload --port 8000`

Frontend:
1. `cd frontend`
2. `npm install`
3. Crear `.env` con `VITE_API_URL=http://127.0.0.1:8000`
4. Levantar: `npm run dev -- --host --port 5173`

## Scripts SQL (opcional)
En `backend/sql/`:
- `01_tables.sql`: crea enum de días y tablas `routine` / `exercise`.
- `02_seed.sql`: datos de ejemplo (3 rutinas + ejercicios).
Ejemplo:
```
psql -h localhost -p 5433 -U postgres -d gym_routines -f backend/sql/01_tables.sql
psql -h localhost -p 5433 -U postgres -d gym_routines -f backend/sql/02_seed.sql
```

## Funcionalidades clave
- Listado con búsqueda, filtro por día y paginación (6).
- Estadísticas (totales, promedio, top por ejercicios, ejercicios por día).
- Exportar rutinas a CSV o PDF.
- Duplicar rutina; CRUD completo.
- Calendario semanal clicable en el detalle.
- Form de alta/edición con drag & drop de ejercicios.
- Modo claro/oscuro con logo según tema; botones e inputs con contraste.

## Endpoints principales (backend)
- `GET /api/rutinas` filtros `nombre`, `dia`, `page`, `size`.
- `GET /api/rutinas/{id}` detalle con ejercicios.
- `POST /api/rutinas` crea con ejercicios anidados (nombre único).
- `PUT /api/rutinas/{id}` sincroniza ejercicios (actualiza, agrega, elimina omitidos).
- `DELETE /api/rutinas/{id}` borra rutina y ejercicios.
- `POST /api/rutinas/{id}/duplicar` clona rutina.
- `GET /api/rutinas/stats` estadísticas rápidas.
- `GET /api/rutinas/export?format=csv|pdf` exporta datos.

## Build/preview
- Frontend build: `cd frontend && npm run build`
- Preview estático: `npm run preview`


