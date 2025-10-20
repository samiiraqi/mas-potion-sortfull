from fastapi import APIRouter, HTTPException, Request, Body
from pydantic import BaseModel
from typing import Optional, Any
from app.multiplayer.game_room import multiplayer_manager
from app.services.game_engine import game_engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class JoinRoomRequest(BaseModel):
    player_name: str
    level_id: int
    room_id: Optional[str] = None

@router.post("/multiplayer/join")
async def join_multiplayer(request: JoinRoomRequest):
    """Join or create a multiplayer room"""
    
    # Get level data (returns dict now)
    level = game_engine.generate_level(request.level_id)
    bottles = level['bottles']  # Access dict, not object attribute!
    
    if request.room_id:
        room = multiplayer_manager.get_room(request.room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
    else:
        room = multiplayer_manager.find_available_room(request.level_id)
        if not room:
            room_id = multiplayer_manager.create_room(request.level_id)
            room = multiplayer_manager.get_room(room_id)
    
    import uuid
    player_id = str(uuid.uuid4())
    
    if not room.add_player(player_id, request.player_name):
        raise HTTPException(status_code=400, detail="Room is full")
    
    if room.can_start():
        room.start_game(bottles)
    
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
async def update_player_progress(body: Any = Body(...)):
    """Update player progress - accepts any JSON"""
    try:
        room_id = body.get("room_id") if isinstance(body, dict) else None
        player_id = body.get("player_id") if isinstance(body, dict) else None
        moves = body.get("moves") if isinstance(body, dict) else None
        bottles = body.get("bottles") if isinstance(body, dict) else None
        completed = body.get("completed", False) if isinstance(body, dict) else False
        
        if not room_id or not player_id or moves is None:
            raise HTTPException(status_code=400, detail=f"Missing fields")
        
        room = multiplayer_manager.get_room(room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        if bottles:
            room.update_bottles(bottles)
        
        room.update_player_move(player_id, moves)
        
        if completed:
            room.mark_player_complete(player_id)
        
        return {
            "success": True,
            "room_state": room.get_state()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/multiplayer/next-level/{room_id}")
async def load_next_level(room_id: str):
    """Load next level for the entire room"""
    try:
        room = multiplayer_manager.get_room(room_id)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        next_level_id = room.level_id + 1
        
        if next_level_id > 50:
            raise HTTPException(status_code=400, detail="No more levels!")
        
        # Generate new level (returns dict)
        level = game_engine.generate_level(next_level_id)
        
        # Reset room
        room.level_id = next_level_id
        room.winner = None
        room.started = True
        
        # Reset players
        for player in room.players:
            player.moves = 0
            player.completed = False
        
        # Set new bottles
        room.start_game(level['bottles'])  # Use dict access!
        
        logger.info(f"Room {room_id} advanced to level {next_level_id}")
        
        return {
            "success": True,
            "level_id": next_level_id,
            "bottles": level['bottles'],  # Use dict access!
            "room_state": room.get_state()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"ERROR loading next level: {e}")
        raise HTTPException(status_code=500, detail=str(e))
