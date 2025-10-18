from typing import List, Dict, Any
from app.models.game import Level

class GameEngine:
    def generate_level(self, level_id: int) -> Level:
        """Generate levels with fewer bottles - better for mobile"""
        
        levels = {
            1: {
                "bottles": [
                    ["red", "blue", "red"],
                    ["blue", "red", "blue"],
                    [],
                    []
                ]
            },
            2: {
                "bottles": [
                    ["red", "red", "blue", "green"],
                    ["blue", "blue", "green", "red"],
                    ["green", "green", "red", "blue"],
                    [],
                    []
                ]
            },
            3: {
                "bottles": [
                    ["red", "blue", "green"],
                    ["green", "red", "blue"],
                    ["blue", "green", "red"],
                    ["red", "blue", "green"],
                    [],
                    []
                ]
            },
            4: {
                "bottles": [
                    ["purple", "orange", "cyan"],
                    ["cyan", "purple", "orange"],
                    ["orange", "cyan", "purple"],
                    ["purple", "orange", "cyan"],
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
