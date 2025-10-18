from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.models.game import Level
from app.services.game_engine import game_engine

router = APIRouter()

class MoveRequest(BaseModel):
    bottles: List[List[str]]
    from_bottle: int
    to_bottle: int

class MoveResponse(BaseModel):
    success: bool
    bottles: List[List[str]]
    is_completed: bool
    message: str

@router.get("/health")
async def health():
    return {"status": "healthy", "service": "game-engine"}

@router.get("/levels/{level_id}", response_model=Level)
async def get_level(level_id: int):
    if level_id < 1:
        raise HTTPException(status_code=400, detail="Level must be >= 1")
    if level_id > 10000:
        raise HTTPException(status_code=400, detail="Level too high")
    return game_engine.generate_level(level_id)

@router.post("/make-move", response_model=MoveResponse)
async def make_move(move: MoveRequest):
    """Execute a move - pours ALL matching colors at once!"""
    print(f"\n🔵 MOVE REQUEST: from bottle {move.from_bottle} to {move.to_bottle}")
    print(f"   Bottles state: {move.bottles}")
    
    # Validate indices
    if move.from_bottle < 0 or move.from_bottle >= len(move.bottles):
        raise HTTPException(status_code=400, detail="Invalid source bottle")
    
    if move.to_bottle < 0 or move.to_bottle >= len(move.bottles):
        raise HTTPException(status_code=400, detail="Invalid target bottle")
    
    if move.from_bottle == move.to_bottle:
        raise HTTPException(status_code=400, detail="Cannot pour into same bottle")
    
    # Check if source is empty
    if not move.bottles[move.from_bottle]:
        raise HTTPException(status_code=400, detail="Source bottle is empty")
    
    # Check if target is full
    if len(move.bottles[move.to_bottle]) >= 4:
        raise HTTPException(status_code=400, detail="Target bottle is full")
    
    # Check color match
    source_color = move.bottles[move.from_bottle][-1]
    if move.bottles[move.to_bottle]:
        target_color = move.bottles[move.to_bottle][-1]
        if source_color != target_color:
            raise HTTPException(status_code=400, detail="Colors don't match")
    
    # Execute move - POUR ALL MATCHING COLORS AT ONCE!
    new_bottles = [bottle[:] for bottle in move.bottles]
    
    # Get top color
    color_to_pour = new_bottles[move.from_bottle][-1]
    print(f"   🎨 Color to pour: {color_to_pour}")
    
    # Count how many matching colors are stacked on top
    count = 0
    for i in range(len(new_bottles[move.from_bottle]) - 1, -1, -1):
        if new_bottles[move.from_bottle][i] == color_to_pour:
            count += 1
        else:
            break
    
    print(f"   📊 Found {count} matching colors on top")
    
    # Limit by available space in target
    available_space = 4 - len(new_bottles[move.to_bottle])
    colors_to_pour = min(count, available_space)
    
    print(f"   📦 Available space: {available_space}")
    print(f"   ✅ Pouring {colors_to_pour} colors")
    
    # Pour all matching colors!
    for i in range(colors_to_pour):
        color = new_bottles[move.from_bottle].pop()
        new_bottles[move.to_bottle].append(color)
        print(f"      Poured #{i+1}: {color}")
    
    print(f"   Result - From: {new_bottles[move.from_bottle]}")
    print(f"   Result - To: {new_bottles[move.to_bottle]}")
    
    is_completed = game_engine.is_level_complete(new_bottles)
    
    return MoveResponse(
        success=True,
        bottles=new_bottles,
        is_completed=is_completed,
        message="🎉 Level Complete!" if is_completed else f"Poured {colors_to_pour} colors!"
    )
