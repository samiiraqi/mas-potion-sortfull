import json
import os
from pathlib import Path
from typing import List, Tuple, Dict, Any

class GameEngine:
    def __init__(self):
        # Load levels from JSON file
        levels_path = Path(__file__).parent.parent / "levels.json"
        with open(levels_path, 'r') as f:
            self.levels_data = json.load(f)
    
    def generate_level(self, level_id: int) -> Dict[str, Any]:
        """Get level from levels.json (120 perfect levels)"""
        level_key = str(level_id)
        
        if level_key not in self.levels_data:
            return {
                "level": level_id,
                "bottles": [],
                "error": "Level not found"
            }
        
        return {
            "level": level_id,
            "bottles": self.levels_data[level_key]["bottles"]
        }
    
    def validate_move(self, bottles: List[List[str]], from_idx: int, to_idx: int) -> Tuple[bool, List[List[str]]]:
        """Validate and execute a pour move"""
        if from_idx < 0 or from_idx >= len(bottles) or to_idx < 0 or to_idx >= len(bottles):
            return False, bottles
        
        if from_idx == to_idx:
            return False, bottles
        
        from_bottle = bottles[from_idx]
        to_bottle = bottles[to_idx]
        
        if len(from_bottle) == 0:
            return False, bottles
        
        if len(to_bottle) >= 4:
            return False, bottles
        
        if len(to_bottle) > 0 and to_bottle[-1] != from_bottle[-1]:
            return False, bottles
        
        new_bottles = [bottle[:] for bottle in bottles]
        color = new_bottles[from_idx].pop()
        new_bottles[to_idx].append(color)
        
        return True, new_bottles
    
    def check_completion(self, bottles: List[List[str]]) -> bool:
        """Check if puzzle is solved"""
        for bottle in bottles:
            if len(bottle) == 0:
                continue
            if len(bottle) != 4:
                return False
            if not all(color == bottle[0] for color in bottle):
                return False
        return True

game_engine = GameEngine()
