from typing import List, Dict, Any
from app.models.game import Level
import random

class GameEngine:
    def generate_level(self, level_id: int) -> Level:
        """Generate 50 challenging levels - ALL with proper empty bottles"""
        
        levels = {
            # EASY (1-10) - 3-4 colors, 2 empty bottles
            1: {
                "bottles": [
                    ["red", "red", "blue", "blue"],
                    ["blue", "blue", "red", "red"],
                    [],
                    []
                ],
                "optimal_moves": 4
            },
            2: {
                "bottles": [
                    ["red", "red", "red", "blue"],
                    ["blue", "blue", "blue", "green"],
                    ["green", "green", "green", "red"],
                    [],
                    []
                ],
                "optimal_moves": 6
            },
            3: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["green", "red", "blue", "yellow"],
                    ["yellow", "green", "red", "blue"],
                    ["blue", "yellow", "green", "red"],
                    [],
                    []
                ],
                "optimal_moves": 8
            },
            4: {
                "bottles": [
                    ["purple", "orange", "cyan", "pink"],
                    ["cyan", "purple", "orange", "pink"],
                    ["pink", "cyan", "purple", "orange"],
                    ["orange", "pink", "cyan", "purple"],
                    [],
                    []
                ],
                "optimal_moves": 8
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
                ],
                "optimal_moves": 12
            },
            6: {
                "bottles": [
                    ["lime", "magenta", "teal", "coral"],
                    ["teal", "lime", "magenta", "coral"],
                    ["coral", "teal", "lime", "magenta"],
                    ["magenta", "coral", "teal", "lime"],
                    [],
                    []
                ],
                "optimal_moves": 8
            },
            7: {
                "bottles": [
                    ["red", "blue", "green", "red"],
                    ["blue", "green", "red", "blue"],
                    ["green", "red", "blue", "green"],
                    ["yellow", "yellow", "yellow", "yellow"],
                    [],
                    []
                ],
                "optimal_moves": 9
            },
            8: {
                "bottles": [
                    ["purple", "orange", "purple", "cyan"],
                    ["cyan", "purple", "orange", "cyan"],
                    ["orange", "cyan", "purple", "orange"],
                    ["pink", "pink", "pink", "pink"],
                    [],
                    []
                ],
                "optimal_moves": 9
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
                ],
                "optimal_moves": 16
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
                ],
                "optimal_moves": 18
            },
            
            # MEDIUM (11-25) - More colors, 2-3 empty bottles
            11: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    ["coral", "lime", "magenta", "teal"],
                    ["pink", "purple", "orange", "cyan"],
                    ["yellow", "red", "blue", "green"],
                    ["green", "yellow", "red", "blue"],
                    [],
                    [],
                    []
                ],
                "optimal_moves": 22
            },
            12: {
                "bottles": [
                    ["red", "blue", "red", "blue"],
                    ["green", "yellow", "green", "yellow"],
                    ["purple", "orange", "purple", "orange"],
                    ["cyan", "pink", "cyan", "pink"],
                    ["lime", "lime", "lime", "lime"],
                    ["magenta", "magenta", "magenta", "magenta"],
                    [],
                    [],
                    []
                ],
                "optimal_moves": 18
            },
            13: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["purple", "orange", "cyan", "pink"],
                    ["lime", "magenta", "teal", "coral"],
                    ["coral", "lime", "pink", "red"],
                    ["magenta", "purple", "cyan", "blue"],
                    ["teal", "orange", "yellow", "green"],
                    ["green", "yellow", "blue", "red"],
                    ["orange", "purple", "pink", "cyan"],
                    ["lime", "magenta", "coral", "teal"],
                    [],
                    [],
                    []
                ],
                "optimal_moves": 36
            },
            14: {
                "bottles": [
                    ["red", "red", "red", "red"],
                    ["blue", "green", "blue", "green"],
                    ["yellow", "purple", "yellow", "purple"],
                    ["orange", "cyan", "orange", "cyan"],
                    ["pink", "pink", "pink", "pink"],
                    ["lime", "lime", "lime", "lime"],
                    [],
                    [],
                    []
                ],
                "optimal_moves": 12
            },
            15: {
                "bottles": [
                    ["red", "blue", "green", "yellow"],
                    ["yellow", "green", "blue", "red"],
                    ["red", "yellow", "green", "blue"],
                    ["blue", "red", "yellow", "green"],
                    ["green", "blue", "red", "yellow"],
                    ["yellow", "green", "blue", "red"],
                    ["purple", "purple", "purple", "purple"],
                    [],
                    [],
                    []
                ],
                "optimal_moves": 24
            },
        }
        
        # Generate remaining levels (16-50) programmatically with GUARANTEED empty bottles
        for i in range(16, 51):
            bottles_data = self._generate_safe_level(i)
            levels[i] = {
                "bottles": bottles_data,
                "optimal_moves": self._calculate_optimal_moves(bottles_data)
            }
        
        level_data = levels.get(level_id, levels[1])
        
        return Level(
            level_id=level_id,
            bottles=level_data["bottles"],
            max_capacity=4,
            optimal_moves=level_data.get("optimal_moves", 20)
        )
    
    def _generate_safe_level(self, level_id: int) -> List[List[str]]:
        """Generate level with GUARANTEED empty bottles"""
        colors = ["red", "blue", "green", "yellow", "purple", "orange", "cyan", "pink", "lime", "magenta", "teal", "coral"]
        
        # Determine difficulty
        if level_id <= 10:
            num_colors = 3
            empty_bottles = 2
        elif level_id <= 25:
            num_colors = min(6 + (level_id - 11) // 3, 8)
            empty_bottles = 2
        elif level_id <= 35:
            num_colors = min(8 + (level_id - 26) // 2, 10)
            empty_bottles = 3
        else:  # Expert
            num_colors = min(10 + (level_id - 36) // 3, 12)
            empty_bottles = 3
        
        selected_colors = colors[:num_colors]
        
        # Create bottles with all colors (4 of each)
        all_pieces = []
        for color in selected_colors:
            all_pieces.extend([color] * 4)
        
        # Shuffle
        random.seed(level_id * 7777)
        random.shuffle(all_pieces)
        
        # Create filled bottles
        filled_bottles = []
        for i in range(0, len(all_pieces), 4):
            filled_bottles.append(all_pieces[i:i+4])
        
        # Add empty bottles
        for _ in range(empty_bottles):
            filled_bottles.append([])
        
        return filled_bottles
    
    def _calculate_optimal_moves(self, bottles: List[List[str]]) -> int:
        """Estimate optimal moves based on complexity"""
        num_filled = sum(1 for b in bottles if len(b) > 0)
        num_empty = sum(1 for b in bottles if len(b) == 0)
        
        # Simple heuristic
        base_moves = num_filled * 2
        difficulty_factor = max(1, num_filled - num_empty - 2)
        
        return base_moves + difficulty_factor * 3
    
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
