from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

# 1. Create the async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False, # Set to True later if you want to see raw SQL queries in the terminal
    future=True
)

# 2. Create a session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# 3. Create a base class for our SQLAlchemy models
Base = declarative_base()

# 4. Dependency to get a DB session (We will use this in our routers)
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
