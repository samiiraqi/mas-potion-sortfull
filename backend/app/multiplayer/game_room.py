from typing import Dict, List, Optional
import time
import uuid

class GameRoom:
    def __init__(self, room_id: str, level_id: int):
        self.room_id = room_id
        self.level_id = level_id
        self.players: Dict[str, dict] = {}
        self.game_state: Dict = {}
        self.started = False
        self.winner: Optional[str] = None
        self.created_at = time.time()
    
    def add_player(self, player_id: str, player_name: str):
        if len(self.players) >= 2:
            return False
        
        self.players[player_id] = {
            "id": player_id,
            "name": player_name,
            "moves": 0,
            "completed": False,
            "time": 0
        }
        return True
    
    def remove_player(self, player_id: str):
        if player_id in self.players:
            del self.players[player_id]
    
    def is_full(self) -> bool:
        return len(self.players) >= 2
    
    def can_start(self) -> bool:
        return len(self.players) == 2 and not self.started
    
    def start_game(self, bottles: List[List[str]]):
        self.started = True
        self.game_state = {
            "bottles": bottles,
            "start_time": time.time()
        }
    
    def update_player_move(self, player_id: str, moves: int):
        if player_id in self.players:
            self.players[player_id]["moves"] = moves
    
    def mark_player_complete(self, player_id: str):
        if player_id in self.players and not self.winner:
            self.players[player_id]["completed"] = True
            self.players[player_id]["time"] = time.time() - self.game_state["start_time"]
            self.winner = player_id
    
    def get_state(self):
        return {
            "room_id": self.room_id,
            "level_id": self.level_id,
            "players": list(self.players.values()),
            "started": self.started,
            "winner": self.winner
        }

class MultiplayerManager:
    def __init__(self):
        self.rooms: Dict[str, GameRoom] = {}
    
    def create_room(self, level_id: int) -> str:
        room_id = str(uuid.uuid4())[:8]
        self.rooms[room_id] = GameRoom(room_id, level_id)
        return room_id
    
    def get_room(self, room_id: str) -> Optional[GameRoom]:
        return self.rooms.get(room_id)
    
    def find_available_room(self, level_id: int) -> Optional[GameRoom]:
        for room in self.rooms.values():
            if room.level_id == level_id and not room.is_full() and not room.started:
                return room
        return None
    
    def cleanup_old_rooms(self, max_age: int = 3600):
        current_time = time.time()
        to_remove = []
        for room_id, room in self.rooms.items():
            if current_time - room.created_at > max_age:
                to_remove.append(room_id)
        
        for room_id in to_remove:
            del self.rooms[room_id]

multiplayer_manager = MultiplayerManager()
