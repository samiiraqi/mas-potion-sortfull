from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from app.multiplayer.game_room import multiplayer_manager
from app.services.game_engine import game_engine

router = APIRouter()

class JoinRoomRequest(BaseModel):
    player_name: str
    level_id: int
    room_id: Optional[str] = None

class MoveUpdate(BaseModel):
    room_id: str
    player_id: str
    moves: int
    bottles: List[List[str]]  # Send bottle state with each move!
    completed: bool = False

@router.post("/multiplayer/join")
async def join_multiplayer(request: JoinRoomRequest):
    """Join or create a multiplayer room"""
    
    # Get bottles for this level FIRST
    level = game_engine.generate_level(request.level_id)
    bottles = level.bottles
    
    # Try to find existing room or create new one
    if request.room_id:
        room = multiplayer_manager.get_room(request.room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
    else:
        room = multiplayer_manager.find_available_room(request.level_id)
        if not room:
            room_id = multiplayer_manager.create_room(request.level_id)
            room = multiplayer_manager.get_room(room_id)
    
    # Generate player ID
    import uuid
    player_id = str(uuid.uuid4())
    
    # Add player to room
    if not room.add_player(player_id, request.player_name):
        raise HTTPException(status_code=400, detail="Room is full")
    
    # If room is full, start the game with shared bottles
    if room.can_start():
        room.start_game(bottles)
    
    # Return current bottle state (shared for all players)
    current_bottles = room.get_bottles() if room.started else bottles
    
    return {
        "room_id": room.room_id,
        "player_id": player_id,
        "bottles": current_bottles,
        "level_id": request.level_id,
        "room_state": room.get_state()
    }

@router.get("/multiplayer/room/{room_id}")
async def get_room_state(room_id: str):
    """Get current room state including bottles"""
    room = multiplayer_manager.get_room(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    return room.get_state()

@router.post("/multiplayer/update")
async def update_player_progress(update: MoveUpdate):
    """Update player progress and sync bottle state"""
    room = multiplayer_manager.get_room(update.room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Update shared bottle state
    room.update_bottles(update.bottles)
    
    # Update player moves
    room.update_player_move(update.player_id, update.moves)
    
    if update.completed:
        room.mark_player_complete(update.player_id)
    
    return {
        "success": True,
        "room_state": room.get_state()
    }
