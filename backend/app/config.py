from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Usa el driver psycopg (psycopg3). Ajusta el string si usas otro driver.
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/gym_routines"

    class Config:
        env_file = ".env"


settings = Settings()


