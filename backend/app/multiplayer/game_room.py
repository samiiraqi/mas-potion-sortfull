from typing import Dict, List, Optional
from datetime import datetime
import random
import string
import time

class Player:
    def __init__(self, player_id: str, name: str):
        self.id = player_id
        self.name = name
        self.moves = 0
        self.completed = False
        self.joined_at = datetime.now()

class GameRoom:
    def __init__(self, room_id: str, level_id: int, max_players: int = 2):
        self.room_id = room_id
        self.level_id = level_id
        self.max_players = max_players
        self.players: List[Player] = []
        self.started = False
        self.winner: Optional[str] = None
        self.created_at = datetime.now()
        self.game_state = {}
        
    def add_player(self, player_id: str, name: str) -> bool:
        if len(self.players) >= self.max_players:
            return False
        self.players.append(Player(player_id, name))
        return True
    
    def can_start(self) -> bool:
        return len(self.players) == self.max_players
    
    def start_game(self, bottles: List[List[str]]):
        self.started = True
        self.game_state = {
            'bottles': bottles,
            'started_at': datetime.now().isoformat()
        }
    
    def update_bottles(self, bottles: List[List[str]]):
        """Update shared bottle state"""
        if 'bottles' not in self.game_state:
            self.game_state['bottles'] = []
        self.game_state['bottles'] = bottles
    
    def get_bottles(self) -> List[List[str]]:
        """Get current shared bottle state"""
        return self.game_state.get('bottles', [])
    
    def update_player_move(self, player_id: str, moves: int):
        for player in self.players:
            if player.id == player_id:
                player.moves = moves
                break
    
    def mark_player_complete(self, player_id: str):
        for player in self.players:
            if player.id == player_id:
                player.completed = True
                if not self.winner:
                    self.winner = player_id
                break
    
    def get_state(self) -> dict:
        return {
            'room_id': self.room_id,
            'level_id': self.level_id,
            'started': self.started,
            'winner': self.winner,
            'bottles': self.get_bottles(),
            'players': [
                {
                    'id': p.id,
                    'name': p.name,
                    'moves': p.moves,
                    'completed': p.completed
                } for p in self.players
            ]
        }

class MultiplayerManager:
    def __init__(self):
        self.rooms: Dict[str, GameRoom] = {}
    
    def create_room(self, level_id: int) -> str:
        # Generate UNIQUE room ID with timestamp to ensure uniqueness
        timestamp = str(int(time.time() * 1000))[-6:]  # Last 6 digits of timestamp
        random_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
        room_id = f"{random_part}{timestamp}"[:8]  # Max 8 chars
        
        # Ensure it's unique
        while room_id in self.rooms:
            random_part = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
            room_id = f"{random_part}{timestamp}"[:8]
        
        self.rooms[room_id] = GameRoom(room_id, level_id)
        return room_id
    
    def get_room(self, room_id: str) -> Optional[GameRoom]:
        return self.rooms.get(room_id)
    
    def find_available_room(self, level_id: int) -> Optional[GameRoom]:
        for room in self.rooms.values():
            if room.level_id == level_id and len(room.players) < room.max_players and not room.started:
                return room
        return None

multiplayer_manager = MultiplayerManager()
