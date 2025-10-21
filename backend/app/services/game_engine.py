import random
from typing import List, Tuple, Dict, Any

class GameEngine:
    COLORS = [
        'red', 'blue', 'green', 'yellow', 
        'purple', 'orange', 'cyan', 'pink',
        'lime', 'magenta', 'teal', 'coral'
    ]
    
    def generate_level(self, level_id: int) -> Dict[str, Any]:
        """Generate 120 levels with perfect difficulty scaling"""
        
        if level_id <= 5:
            num_colors = 3
        elif level_id <= 10:
            num_colors = 4
        elif level_id <= 20:
            num_colors = 5
        elif level_id <= 35:
            num_colors = 6
        elif level_id <= 50:
            num_colors = 7
        elif level_id <= 65:
            num_colors = 8
        elif level_id <= 80:
            num_colors = 9
        elif level_id <= 95:
            num_colors = 10
        elif level_id <= 110:
            num_colors = 11
        else:
            num_colors = 12
        
        num_empty = 2
        
        colors = random.sample(self.COLORS, num_colors)
        
        all_pieces = []
        for color in colors:
            all_pieces.extend([color] * 4)
        
        shuffle_count = 50 + (level_id // 2)
        for _ in range(shuffle_count):
            random.shuffle(all_pieces)
        
        bottles = []
        
        for bottle_idx in range(num_colors):
            bottle = []
            for _ in range(4):
                if all_pieces:
                    piece = all_pieces.pop(0)
                    bottle.append(piece)
            bottles.append(bottle)
        
        for _ in range(num_empty):
            bottles.append([])
        
        random.shuffle(bottles)
        
        optimal_moves = num_colors * 8 + level_id // 2
        
        return {
            'level_id': level_id,
            'bottles': bottles,
            'optimal_moves': optimal_moves
        }
    
    def validate_move(self, bottles: List[List[str]], from_idx: int, to_idx: int) -> Tuple[bool, List[List[str]]]:
        if from_idx < 0 or from_idx >= len(bottles):
            return False, bottles
        if to_idx < 0 or to_idx >= len(bottles):
            return False, bottles
        if from_idx == to_idx:
            return False, bottles
        
        from_bottle = bottles[from_idx]
        to_bottle = bottles[to_idx]
        
        if not from_bottle:
            return False, bottles
        if len(to_bottle) >= 4:
            return False, bottles
        
        color_to_pour = from_bottle[-1]
        if to_bottle and to_bottle[-1] != color_to_pour:
            return False, bottles
        
        count = 1
        for i in range(len(from_bottle) - 2, -1, -1):
            if from_bottle[i] == color_to_pour:
                count += 1
            else:
                break
        
        space_available = 4 - len(to_bottle)
        pour_count = min(count, space_available)
        
        new_bottles = [bottle[:] for bottle in bottles]
        for _ in range(pour_count):
            new_bottles[to_idx].append(new_bottles[from_idx].pop())
        
        return True, new_bottles
    
    def check_completion(self, bottles: List[List[str]]) -> bool:
        for bottle in bottles:
            if not bottle:
                continue
            if len(bottle) != 4:
                return False
            if not all(color == bottle[0] for color in bottle):
                return False
        return True

game_engine = GameEngine()
