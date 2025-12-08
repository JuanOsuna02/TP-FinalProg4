# Backend - Gestor de Rutinas de Gimnasio

API RESTful construida con FastAPI y SQLModel para gestionar rutinas y ejercicios de gimnasio.

## Requisitos previos
- Python 3.10+
- PostgreSQL en ejecución

## Instalación
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## Configuración de base de datos
1) Crea la base de datos en PostgreSQL, por ejemplo:
```sql
CREATE DATABASE gym_routines;
```
2) Define el string de conexión en un archivo `.env` en `backend/`:
```
DATABASE_URL=postgresql+psycopg://usuario:password@localhost:5432/gym_routines
```
- Formato: `postgresql+psycopg://<user>:<password>@<host>:<port>/<db>` (driver psycopg3).
- El valor por defecto (si no defines `.env`) es `postgresql+psycopg://postgres:postgres@localhost:5432/gym_routines`.

## Ejecución
```bash
cd backend
.\.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
- Documentación automática Swagger: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

## Endpoints principales
- `GET /api/rutinas` listar rutinas
- `GET /api/rutinas/{id}` detalle de rutina
- `GET /api/rutinas/buscar?nombre=texto` búsqueda por nombre (case-insensitive)
- `POST /api/rutinas` crear rutina (permite ejercicios anidados)
- `PUT /api/rutinas/{id}` actualizar rutina y ejercicios (sincroniza lista)
- `DELETE /api/rutinas/{id}` eliminar rutina (cascada ejercicios)
- `POST /api/rutinas/{id}/ejercicios` agregar ejercicio a una rutina
- `PUT /api/ejercicios/{id}` actualizar ejercicio
- `DELETE /api/ejercicios/{id}` eliminar ejercicio

## Estructura del proyecto
```
backend/
├─ app/
│  ├─ main.py           # crea la app FastAPI, CORS y rutas
│  ├─ config.py         # lee DATABASE_URL desde .env
│  ├─ database.py       # engine y Session
│  ├─ models.py         # modelos SQLModel (Rutina y Ejercicio)
│  ├─ schemas.py        # esquemas de entrada/salida (Pydantic/SQLModel)
│  └─ routers/
│     ├─ routines.py    # endpoints CRUD de rutinas y búsqueda
│     └─ exercises.py   # endpoints específicos de ejercicios
├─ requirements.txt
└─ README.md
```

## Notas
- Las tablas se crean automáticamente al iniciar la app (`init_db` en `startup`).
- Validaciones:
  - Nombre de rutina único.
  - Series y repeticiones > 0; peso > 0 si se envía.
  - Día de la semana limitado a: Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo.
- Eliminación de rutina borra ejercicios asociados (cascada `delete-orphan`).


