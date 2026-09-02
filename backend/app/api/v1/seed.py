from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db

router = APIRouter()

def run_seed_task():
    import asyncio
    import os
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from scripts.seed_standards import seed_data
    
    # Run the seed logic
    data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "sample_standards.json")
    asyncio.run(seed_data(data_path))

@router.get("/seed")
async def seed_database(background_tasks: BackgroundTasks):
    """Trigger database seeding and AI embedding generation in the background."""
    background_tasks.add_task(run_seed_task)
    return {"message": "Seed task started in the background! It will take about 1-2 minutes to download models and generate embeddings."}
