# Cómo iniciar el proyecto

Guía rápida para levantar backend (API) y frontend (SPA) en local.

## Backend (FastAPI + PostgreSQL)
1) Requisitos: Python 3.12+, PostgreSQL corriendo (puerto 5433).
2) Crear entorno e instalar deps:
```
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```
3) Configurar `.env` en `backend/app/.env`:
```
DATABASE_URL=postgresql+psycopg://postgres:constanza14@localhost:5433/gym_routines
```
4) (Opcional) Crear DB y datos de ejemplo:
```
psql -h localhost -p 5433 -U postgres -c "CREATE DATABASE gym_routines;"
psql -h localhost -p 5433 -U postgres -d gym_routines -f backend/sql/01_tables.sql
psql -h localhost -p 5433 -U postgres -d gym_routines -f backend/sql/02_seed.sql
```
5) Levantar la API:
```
cd backend
.\.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8000
```
6) Comprobar:
- Health: http://localhost:8000/health  
- Docs: http://localhost:8000/docs

## Frontend (React + Vite)
1) Requisitos: Node 18+, npm.
2) Instalar deps:
```
cd frontend
npm install
```
3) Configurar API URL (opcional) en `frontend/.env`:
```
VITE_API_URL=http://127.0.0.1:8000
```
4) Levantar en dev:
```
cd frontend
$Env:VITE_API_URL="http://127.0.0.1:8000"
npm run dev -- --host --port 5173
```
5) Abrir la app: http://localhost:5173

## Problemas comunes
- Si la API no arranca: verifica credenciales/puerto de Postgres; elimina `Env:DATABASE_URL` para no pisar el `.env`.
- Si el front no carga datos: confirma que el backend esté en 8000 y `VITE_API_URL` apunte ahí.
- Puertos ocupados: cambia `--port` o libera el puerto (por ejemplo 5173/8000).

