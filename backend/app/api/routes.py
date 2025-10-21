from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.game_engine import game_engine

router = APIRouter()

class MakeMoveRequest(BaseModel):
    bottles: List[List[str]]
    from_bottle: int
    to_bottle: int

@router.get("/levels/{level_id}")
async def get_level(level_id: int):
    """Get a specific level - now supports 120 levels!"""
    if level_id < 1 or level_id > 120:
        raise HTTPException(status_code=404, detail="Level not found. Levels 1-120 available.")
    
    level_data = game_engine.generate_level(level_id)
    return level_data

@router.post("/make-move")
async def make_move(request: MakeMoveRequest):
    """Validate and make a move"""
    try:
        success, new_bottles = game_engine.validate_move(
            request.bottles,
            request.from_bottle,
            request.to_bottle
        )
        
        if not success:
            return {
                "success": False,
                "message": "Invalid move",
                "bottles": request.bottles
            }
        
        is_completed = game_engine.check_completion(new_bottles)
        
        return {
            "success": True,
            "bottles": new_bottles,
            "is_completed": is_completed
        }
        
    except Exception as e:
        print(f"ERROR in make_move: {e}")
        raise HTTPException(status_code=500, detail=str(e))
