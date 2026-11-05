from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # This tells Pydantic to look for a .env file in the same directory
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Define the variables you expect to find in the .env file
    DATABASE_URL: str

# Create a single, global instance of the settings
settings = Settings()
