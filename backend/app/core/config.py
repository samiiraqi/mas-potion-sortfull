from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "Water Sort Puzzle API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    SERVICE_HOST: str = "0.0.0.0"
    SERVICE_PORT: int = 8001
    
    API_V1_PREFIX: str = "/api/v1"
    
    # Allow all origins for now
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
