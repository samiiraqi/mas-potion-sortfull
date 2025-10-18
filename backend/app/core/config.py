from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Potion Sort - Game Engine"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    SERVICE_HOST: str = "0.0.0.0"
    SERVICE_PORT: int = 8001
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    class Config:
        env_file = ".env"

settings = Settings()
