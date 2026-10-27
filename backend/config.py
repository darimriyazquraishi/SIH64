import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

def _get_database_uri(env_var="DATABASE_URL", default_dbname="aicte_complaints"):
    uri = os.getenv(env_var)
    if not uri:
        # Detect whether psycopg2 or modern psycopg v3 is installed
        driver = "+psycopg"
        try:
            import psycopg2  # noqa: F401
            driver = "+psycopg2"
        except ImportError:
            pass
        return f"postgresql{driver}://postgres@127.0.0.1:5432/{default_dbname}"

    # If URI specifies psycopg2 but only psycopg v3 is installed, seamlessly adapt dialect
    try:
        import psycopg2  # noqa: F401
    except ImportError:
        try:
            import psycopg  # noqa: F401
            if "postgresql+psycopg2://" in uri:
                uri = uri.replace("postgresql+psycopg2://", "postgresql+psycopg://")
            elif uri.startswith("postgresql://"):
                uri = uri.replace("postgresql://", "postgresql+psycopg://")
        except ImportError:
            pass

    return uri

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "aicte-portal-dev-secret-key-change-in-prod-2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "aicte-jwt-secret-key-2026")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)
    
    # Primary database: PostgreSQL (supports both psycopg2 and modern psycopg v3)
    SQLALCHEMY_DATABASE_URI = _get_database_uri("DATABASE_URL", "aicte_complaints")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

    # Cross-Bureau Overlap Detection Configuration
    OVERLAP_EXACT_MATCH_SCORE = 1.0
    OVERLAP_FUZZY_INSTITUTION_THRESHOLD = 0.82
    OVERLAP_TEXT_SIMILARITY_THRESHOLD = 0.45
    OVERLAP_HYBRID_ALERT_THRESHOLD = 0.60
    
    # Administrative & Demo Configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max upload
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000").split(",")


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = _get_database_uri("TEST_DATABASE_URL", "aicte_complaints_test")
    WTF_CSRF_ENABLED = False
