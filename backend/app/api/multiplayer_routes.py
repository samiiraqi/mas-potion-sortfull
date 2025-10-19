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
    
    level = game_engine.generate_level(request.level_id)
    bottles = level.bottles
    
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
        logger.info("=== RECEIVED UPDATE ===")
        logger.info(f"Body: {body}")
        logger.info(f"Body type: {type(body)}")
        
        room_id = body.get("room_id") if isinstance(body, dict) else None
        player_id = body.get("player_id") if isinstance(body, dict) else None
        moves = body.get("moves") if isinstance(body, dict) else None
        bottles = body.get("bottles") if isinstance(body, dict) else None
        completed = body.get("completed", False) if isinstance(body, dict) else False
        
        logger.info(f"Extracted - room_id: {room_id}, player_id: {player_id}, moves: {moves}")
        logger.info("=====================")
        
        if not room_id or not player_id or moves is None:
            raise HTTPException(status_code=400, detail=f"Missing fields: room_id={room_id}, player_id={player_id}, moves={moves}")
        
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
        logger.error(f"Error type: {type(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
