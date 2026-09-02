from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables automatically
    from app.database import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Load ML models lazily on first request or here
    yield
    
    # Cleanup on shutdown
    await engine.dispose()

app = FastAPI(
    title="Indian Standards Recommendation Engine API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.router import api_router
app.include_router(api_router)

@app.get("/")
async def root():
    return {"service": "Indian Standards Recommendation Engine", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
