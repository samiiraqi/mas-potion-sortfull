from typing import List, Dict, Any
from app.models.game import Level

class GameEngine:
    def generate_level(self, level_id: int) -> Level:
        """Generate 20 challenging levels"""
        
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
            },
            6: {
                "bottles": [
                    ["lime", "magenta", "teal", "coral"],
                    ["teal", "lime", "magenta", "coral"],
                    ["coral", "teal", "lime", "magenta"],
                    ["magenta", "coral", "teal", "lime"],
                    [],
                    []
                ]
            },
            7: {
                "bottles": [
                    ["red", "blue", "green", "red"],
                    ["blue", "green", "red", "blue"],
                    ["green", "red", "blue", "green"],
                    ["yellow", "yellow", "yellow", "yellow"],
                    [],
                    []
                ]
            },
            8: {
                "bottles": [
                    ["purple", "orange", "purple", "cyan"],
                    ["cyan", "purple", "orange", "cyan"],
                    ["orange", "cyan", "purple", "orange"],
                    ["pink", "pink", "pink", "pink"],
                    [],
                    []
                ]
            },
            9: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["pink", "red", "blue", "green"],
                    ["yellow", "purple", "orange", "cyan"],
                    ["cyan", "pink", "red", "blue"],
                    ["green", "yellow", "purple", "orange"],
                    [],
                    [],
                    []
                ]
            },
            10: {
                "bottles": [
                    ["lime", "magenta", "teal", "coral"],
                    ["red", "blue", "green", "yellow"],
                    ["yellow", "lime", "magenta", "teal"],
                    ["coral", "red", "blue", "green"],
                    ["green", "yellow", "lime", "magenta"],
                    ["teal", "coral", "red", "blue"],
                    [],
                    [],
                    []
                ]
            },
            11: {
                "bottles": [
                    ["red", "red", "blue", "blue"],
                    ["green", "green", "yellow", "yellow"],
                    ["purple", "purple", "orange", "orange"],
                    ["cyan", "cyan", "pink", "pink"],
                    [],
                    []
                ]
            },
            12: {
                "bottles": [
                    ["red", "blue", "red", "blue"],
                    ["green", "yellow", "green", "yellow"],
                    ["purple", "orange", "purple", "orange"],
                    ["cyan", "pink", "cyan", "pink"],
                    ["lime", "lime", "lime", "lime"],
                    [],
                    []
                ]
            },
            13: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    ["coral", "lime", "magenta", "teal"],
                    ["pink", "purple", "orange", "cyan"],
                    ["yellow", "red", "blue", "green"],
                    [],
                    [],
                    []
                ]
            },
            14: {
                "bottles": [
                    ["red", "red", "red", "red"],
                    ["blue", "green", "blue", "green"],
                    ["yellow", "purple", "yellow", "purple"],
                    ["orange", "cyan", "orange", "cyan"],
                    ["pink", "pink", "pink", "pink"],
                    [],
                    []
                ]
            },
            15: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["yellow", "green", "blue", "red"],
                    ["red", "yellow", "green", "blue"],
                    ["blue", "red", "yellow", "green"],
                    ["green", "blue", "red", "yellow"],
                    ["yellow", "green", "blue", "red"],
                    [],
                    [],
                    []
                ]
            },
            16: {
                "bottles": [
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    ["coral", "teal", "magenta", "lime"],
                    ["pink", "cyan", "orange", "purple"],
                    ["purple", "pink", "lime", "coral"],
                    ["orange", "cyan", "magenta", "teal"],
                    [],
                    [],
                    []
                ]
            },
            17: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    [],
                    [],
                    [],
                    []
                ]
            },
            18: {
                "bottles": [
                    ["red", "red", "blue", "green"],
                    ["blue", "green", "yellow", "yellow"],
                    ["purple", "purple", "orange", "cyan"],
                    ["orange", "cyan", "pink", "pink"],
                    ["lime", "lime", "magenta", "teal"],
                    ["magenta", "teal", "coral", "coral"],
                    [],
                    [],
                    []
                ]
            },
            19: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    ["coral", "teal", "magenta", "lime"],
                    ["pink", "cyan", "orange", "purple"],
                    ["yellow", "green", "blue", "red"],
                    ["red", "yellow", "lime", "coral"],
                    ["blue", "green", "magenta", "teal"],
                    ["purple", "orange", "cyan", "pink"],
                    [],
                    [],
                    []
                ]
            },
            20: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    [],
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
        for bottle in bottles:
            if len(bottle) == 0:
                continue
            if len(bottle) != 4:
                return False
            if not all(color == bottle[0] for color in bottle):
                return False
        return True

game_engine = GameEngine()
