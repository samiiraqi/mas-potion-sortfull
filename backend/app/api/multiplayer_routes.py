from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
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
    completed: bool = False

@router.post("/multiplayer/join")
async def join_multiplayer(request: JoinRoomRequest):
    """Join or create a multiplayer room"""
    
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
    
    # If room is full, start the game
    if room.can_start():
        level = game_engine.generate_level(room.level_id)
        room.start_game(level.bottles)
    
    return {
        "room_id": room.room_id,
        "player_id": player_id,
        "room_state": room.get_state(),
        "bottles": room.game_state.get("bottles") if room.started else None
    }

@router.get("/multiplayer/room/{room_id}")
async def get_room_state(room_id: str):
    """Get current room state"""
    room = multiplayer_manager.get_room(room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    return room.get_state()

@router.post("/multiplayer/update")
async def update_player_progress(update: MoveUpdate):
    """Update player progress"""
    room = multiplayer_manager.get_room(update.room_id)
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    room.update_player_move(update.player_id, update.moves)
    
    if update.completed:
        room.mark_player_complete(update.player_id)
    
    return {
        "success": True,
        "room_state": room.get_state()
    }
