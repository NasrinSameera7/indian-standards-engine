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
@router.get("/seed")
async def seed_database():
    """Trigger database seeding synchronously so we can see any errors."""
    import os
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from scripts.seed_standards import seed_data
    
    data_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "sample_standards.json")
    
    try:
        await seed_data(data_path)
        return {"message": "Success! Database seeded and embeddings generated."}
    except Exception as e:
        import traceback
        return {"error": str(e), "traceback": traceback.format_exc()}
