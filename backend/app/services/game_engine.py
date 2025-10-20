import random
from typing import List, Tuple, Dict, Any

class GameEngine:
    COLORS = [
        'red', 'blue', 'green', 'yellow', 
        'purple', 'orange', 'cyan', 'pink',
        'lime', 'magenta', 'teal', 'coral'
    ]
    
    def generate_level(self, level_id: int) -> Dict[str, Any]:
        """ULTIMATE CHAOS - Maximum mixing, no patterns!"""
        
        # Difficulty scaling
        if level_id <= 3:
            num_colors = 3
            num_empty = 2
        elif level_id <= 6:
            num_colors = 4
            num_empty = 2
        elif level_id <= 10:
            num_colors = 5
            num_empty = 2
        elif level_id <= 15:
            num_colors = 6
            num_empty = 2
        elif level_id <= 20:
            num_colors = 7
            num_empty = 2
        elif level_id <= 25:
            num_colors = 8
            num_empty = 2
        elif level_id <= 30:
            num_colors = 9
            num_empty = 2
        elif level_id <= 35:
            num_colors = 10
            num_empty = 2
        elif level_id <= 40:
            num_colors = 11
            num_empty = 2
        else:
            num_colors = 12
            num_empty = 2
        
        colors = random.sample(self.COLORS, num_colors)
        
        # Create 4 of each color
        all_pieces = []
        for color in colors:
            all_pieces.extend([color] * 4)
        
        # CRITICAL: Shuffle extensively
        for _ in range(100):  # 100 SHUFFLES!
            random.shuffle(all_pieces)
        
        # Create bottles with FORCED mixing strategy
        bottles = []
        
        # Strategy: Ensure NO bottle has more than 2 of the same color together!
        for bottle_idx in range(num_colors):
            bottle = []
            attempts = 0
            max_attempts = 1000
            
            while len(bottle) < 4 and attempts < max_attempts:
                # Pick random piece
                if all_pieces:
                    piece = all_pieces.pop(0)
                    
                    # Check if this creates 3+ same colors in a row
                    if len(bottle) >= 2 and bottle[-1] == bottle[-2] == piece:
                        # Would create 3 in a row - put piece back and try another
                        all_pieces.append(piece)
                        random.shuffle(all_pieces)
                        attempts += 1
                    else:
                        # OK to add
                        bottle.append(piece)
                        attempts = 0
                else:
                    break
            
            # If we couldn't fill properly, just shuffle what we have
            if len(bottle) < 4 and all_pieces:
                while len(bottle) < 4 and all_pieces:
                    bottle.append(all_pieces.pop(0))
            
            bottles.append(bottle)
        
        # Add empty bottles
        for _ in range(num_empty):
            bottles.append([])
        
        # Final shuffle
        random.shuffle(bottles)
        
        optimal_moves = num_colors * 10 + level_id * 3
        
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
