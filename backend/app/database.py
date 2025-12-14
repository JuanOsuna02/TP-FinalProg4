from sqlmodel import Session, SQLModel, create_engine

from .config import settings


# Motor de conexión global a la base
engine = create_engine(settings.database_url, echo=False)


def init_db() -> None:
    # Crea tablas según los modelos declarados
    SQLModel.metadata.create_all(engine)


def get_session():
    # Generador de sesión por request para FastAPI (cierre automático)
    with Session(engine) as session:
        yield session




