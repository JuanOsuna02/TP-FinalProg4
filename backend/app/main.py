from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers import exercises, routines


def create_app() -> FastAPI:
    # Crea la app FastAPI con título y versión
    app = FastAPI(title="Gestor de Rutinas de Gimnasio", version="1.0.0")

    # Habilita CORS abierto para desarrollo (front Vite)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Registra routers de rutinas y ejercicios
    app.include_router(routines.router)
    app.include_router(exercises.router)

    # Crea tablas al iniciar la app
    @app.on_event("startup")
    def on_startup():
        init_db()

    # Healthcheck simple
    @app.get("/health", tags=["Sistema"])
    def health():
        return {"status": "ok"}

    return app


app = create_app()




