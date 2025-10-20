import random
from typing import List, Tuple, Dict, Any

class GameEngine:
    COLORS = [
        'red', 'blue', 'green', 'yellow', 
        'purple', 'orange', 'cyan', 'pink',
        'lime', 'magenta', 'teal', 'coral'
    ]
    
    def generate_level(self, level_id: int) -> Dict[str, Any]:
        """Generate a level with REAL difficulty scaling"""
        
        # AGGRESSIVE difficulty scaling
        if level_id <= 5:
            num_colors = 3  # Easy start
            num_empty = 2   # 2 empty bottles
        elif level_id <= 10:
            num_colors = 4  # Getting harder
            num_empty = 2
        elif level_id <= 15:
            num_colors = 5  # Medium
            num_empty = 2
        elif level_id <= 20:
            num_colors = 6  # Medium-Hard
            num_empty = 2
        elif level_id <= 25:
            num_colors = 7  # Hard - only 2 empty!
            num_empty = 2
        elif level_id <= 30:
            num_colors = 8  # Very Hard
            num_empty = 2
        elif level_id <= 35:
            num_colors = 9  # Expert
            num_empty = 2
        elif level_id <= 40:
            num_colors = 10  # Master
            num_empty = 2
        elif level_id <= 45:
            num_colors = 11  # Insane
            num_empty = 2
        else:
            num_colors = 12  # IMPOSSIBLE!
            num_empty = 2
        
        # Select colors
        colors = random.sample(self.COLORS, num_colors)
        
        # Create exactly 4 pieces of each color
        all_pieces = []
        for color in colors:
            all_pieces.extend([color] * 4)
        
        # AGGRESSIVE SHUFFLING - make it REALLY mixed!
        for _ in range(5):  # Shuffle 5 times for maximum chaos
            random.shuffle(all_pieces)
        
        # Total bottles = colors + empty bottles
        num_bottles = num_colors + num_empty
        
        # Distribute pieces RANDOMLY into bottles (maximum chaos!)
        bottles = [[] for _ in range(num_bottles)]
        
        # Fill bottles randomly (not in order!)
        bottle_indices = list(range(num_colors))  # Only fill non-empty bottles
        
        for piece in all_pieces:
            # Pick a random bottle that's not full yet
            available = [i for i in bottle_indices if len(bottles[i]) < 4]
            if available:
                chosen = random.choice(available)
                bottles[chosen].append(piece)
        
        # Add empty bottles
        for _ in range(num_empty):
            bottles.append([])
        
        # Final shuffle of all bottles
        random.shuffle(bottles)
        
        # Calculate realistic optimal moves
        optimal_moves = num_colors * 4 + (level_id // 3)
        
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
        
        # Can't pour from empty bottle
        if not from_bottle:
            return False, bottles
        
        # Target bottle is full
        if len(to_bottle) >= 4:
            return False, bottles
        
        # Get the color to pour
        color_to_pour = from_bottle[-1]
        
        # If target is not empty, colors must match
        if to_bottle and to_bottle[-1] != color_to_pour:
            return False, bottles
        
        # Count matching colors on top
        count = 1
        for i in range(len(from_bottle) - 2, -1, -1):
            if from_bottle[i] == color_to_pour:
                count += 1
            else:
                break
        
        # Calculate pour amount
        space_available = 4 - len(to_bottle)
        pour_count = min(count, space_available)
        
        # Execute pour
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
