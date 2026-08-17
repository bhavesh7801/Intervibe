import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# Get Supabase PostgreSQL connection string from environment variables
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/postgres"
)

if "YOUR_DATABASE_PASSWORD" in DATABASE_URL:
    print("\n⚠️ WARNING: Please replace 'YOUR_DATABASE_PASSWORD' in backend/.env with your actual Supabase database password!\n")

try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={"connect_timeout": 5} if "postgresql" in DATABASE_URL else {}
    )
    # Test connection on startup
    with engine.connect() as test_conn:
        pass
except Exception as e:
    print(f"Supabase PostgreSQL connection notice ({e}). Falling back to local SQLite database.")
    local_db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.db")
    DATABASE_URL = f"sqlite:///{local_db_path}"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

from sqlalchemy import text

def init_db_schema():
    """Ensure database tables, columns, and Row Level Security (RLS) policies exist on server startup."""
    try:
        Base.metadata.create_all(bind=engine)
        with engine.connect() as conn:
            if "postgresql" in str(engine.url):
                conn.execute(text("""
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR;
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP;
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS starred_questions JSONB DEFAULT '[]'::jsonb;
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS weak_areas JSONB DEFAULT '[]'::jsonb;

                    -- ENABLE ROW LEVEL SECURITY (RLS) TO PREVENT PUBLIC SUPABASE REST DATA LEAKS
                    ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
                    ALTER TABLE IF EXISTS sessions ENABLE ROW LEVEL SECURITY;
                    ALTER TABLE IF EXISTS questions ENABLE ROW LEVEL SECURITY;
                    ALTER TABLE IF EXISTS answers ENABLE ROW LEVEL SECURITY;
                    ALTER TABLE IF EXISTS feedback ENABLE ROW LEVEL SECURITY;

                    -- REVOKE DIRECT PUBLIC POSTGREST ACCESS FROM ANON ROLE
                    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
                """))
                conn.commit()
                print("[SECURITY] Supabase PostgreSQL Row Level Security (RLS) enabled on all tables.")
            else:
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN starred_questions JSON;"))
                    conn.commit()
                except Exception:
                    pass
                try:
                    conn.execute(text("ALTER TABLE users ADD COLUMN weak_areas JSON;"))
                    conn.commit()
                except Exception:
                    pass
    except Exception as e:
        print("Schema initialization note:", e)

def get_db():
    """Dependency generator for database sessions with automatic transaction rollback safety."""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()