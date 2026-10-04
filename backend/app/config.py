from dataclasses import dataclass
from functools import lru_cache
import os


@dataclass(frozen=True)
class Settings:
    app_name: str
    environment: str
    cors_origins: tuple[str, ...]


@lru_cache
def get_settings() -> Settings:
    origins = os.getenv("API_CORS_ORIGINS", "http://127.0.0.1:5173")
    return Settings(
        app_name=os.getenv("APP_NAME", "AI Invoice Processing Agent"),
        environment=os.getenv("APP_ENV", "development"),
        cors_origins=tuple(origin.strip() for origin in origins.split(",") if origin.strip()),
    )
