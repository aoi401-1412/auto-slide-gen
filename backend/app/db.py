import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    
settings = Settings()

supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
