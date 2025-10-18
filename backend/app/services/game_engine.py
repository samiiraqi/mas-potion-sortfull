from typing import List, Dict, Any
from app.models.game import Level

class GameEngine:
    def generate_level(self, level_id: int) -> Level:
        """Generate levels with FULL bottles"""
        
        levels = {
            1: {
                "bottles": [
                    ["red", "red", "blue", "blue"],
                    ["blue", "blue", "red", "red"],
                    [],
                    []
                ]
            },
            2: {
                "bottles": [
                    ["red", "red", "red", "blue"],
                    ["blue", "blue", "blue", "green"],
                    ["green", "green", "green", "red"],
                    [],
                    []
                ]
            },
            3: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["green", "red", "blue", "yellow"],
                    ["yellow", "green", "red", "blue"],
                    ["blue", "yellow", "green", "red"],
                    [],
                    []
                ]
            },
            4: {
                "bottles": [
                    ["purple", "orange", "cyan", "pink"],
                    ["cyan", "purple", "orange", "pink"],
                    ["pink", "cyan", "purple", "orange"],
                    ["orange", "pink", "cyan", "purple"],
                    [],
                    []
                ]
            },
            5: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["yellow", "red", "blue", "green"],
                    ["green", "yellow", "red", "blue"],
                    ["blue", "green", "yellow", "red"],
                    ["red", "blue", "green", "yellow"],
                    [],
                    [],
                    []
                ]
            }
        }
        
        level_data = levels.get(level_id, levels[1])
        
        return Level(
            level_id=level_id,
            bottles=level_data["bottles"],
            max_capacity=4
        )
    
    def is_level_complete(self, bottles: List[List[str]]) -> bool:
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
