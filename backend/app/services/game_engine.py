import random
from typing import List, Tuple, Dict, Any

class GameEngine:
    COLORS = [
        'red', 'blue', 'green', 'yellow', 
        'purple', 'orange', 'cyan', 'pink',
        'lime', 'magenta', 'teal', 'coral'
    ]
    
    def generate_level(self, level_id: int) -> Dict[str, Any]:
        """Generate CHAOTIC puzzles that require REAL thinking!"""
        
        # Aggressive scaling
        if level_id <= 5:
            num_colors = 3
            num_empty = 2  # Start with 2 empty
        elif level_id <= 10:
            num_colors = 4
            num_empty = 2
        elif level_id <= 15:
            num_colors = 5
            num_empty = 2
        elif level_id <= 20:
            num_colors = 6
            num_empty = 2
        elif level_id <= 25:
            num_colors = 7
            num_empty = 2  # Only 2 empty with 7 colors = HARD!
        elif level_id <= 30:
            num_colors = 8
            num_empty = 2
        elif level_id <= 35:
            num_colors = 9
            num_empty = 2
        elif level_id <= 40:
            num_colors = 10
            num_empty = 2
        elif level_id <= 45:
            num_colors = 11
            num_empty = 2
        else:
            num_colors = 12
            num_empty = 2  # INSANE: 12 colors, 2 empty!
        
        colors = random.sample(self.COLORS, num_colors)
        
        # Create pieces
        all_pieces = []
        for color in colors:
            all_pieces.extend([color] * 4)
        
        # CRITICAL: MAXIMUM CHAOS DISTRIBUTION
        # Instead of filling bottles sequentially, distribute RANDOMLY!
        
        # Shuffle pieces extensively
        for _ in range(20):  # 20 SHUFFLES for extreme randomness!
            random.shuffle(all_pieces)
        
        # Create bottles and fill COMPLETELY RANDOMLY
        bottles = [[] for _ in range(num_colors)]
        
        # Distribute pieces ONE BY ONE to random bottles
        for piece in all_pieces:
            # Find bottles that aren't full
            available_bottles = [i for i in range(len(bottles)) if len(bottles[i]) < 4]
            if available_bottles:
                # Pick a RANDOM bottle to add this piece
                chosen_bottle = random.choice(available_bottles)
                bottles[chosen_bottle].append(piece)
        
        # Add empty bottles
        for _ in range(num_empty):
            bottles.append([])
        
        # Shuffle bottle order
        random.shuffle(bottles)
        
        # Higher optimal moves for complex levels
        optimal_moves = num_colors * 6 + level_id
        
        return {
            'level_id': level_id,
            'bottles': bottles,
            'optimal_moves': optimal_moves
        }
    
    def validate_move(self, bottles: List[List[str]], from_idx: int, to_idx: int) -> Tuple[bool, List[List[str]]]:
        """Validate and execute a move"""
        
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
        """Check if level is complete"""
        for bottle in bottles:
            if not bottle:
                continue
            
            if len(bottle) != 4:
                return False
            
            if not all(color == bottle[0] for color in bottle):
                return False
        
        return True

game_engine = GameEngine()
