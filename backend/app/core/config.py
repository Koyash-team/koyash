from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    MONGODB_URI: str
    MONGO_DB_NAME: str = "koyash"

    # Minimum number of high-segment products (after hard filters) required to
    # attempt a "high" budget basket. Current inventory has 3 high products, so
    # this guard will fire a 422 until the catalog grows. Raise the value via
    # env to re-enable high budget without code changes.
    MIN_HIGH_PRODUCTS: int = 8

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
