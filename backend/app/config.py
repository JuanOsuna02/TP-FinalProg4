from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    _env_path = Path(__file__).resolve().parent / ".env"
    model_config = SettingsConfigDict(env_file=_env_path, extra="allow", env_file_encoding="utf-8")
    # Cadena de conexión; usa psycopg3. Se sobreescribe con DATABASE_URL del .env
    database_url: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/gym_routines",
        validation_alias="DATABASE_URL",
    )


# Instancia de settings para usar en el resto de la app
settings = Settings()


