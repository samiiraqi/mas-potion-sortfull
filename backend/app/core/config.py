from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Water Sort Puzzle API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    SERVICE_HOST: str = "0.0.0.0"
    SERVICE_PORT: int = 8001
    
    API_V1_PREFIX: str = "/api/v1"
    
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.onrender.com",
        "*"
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
