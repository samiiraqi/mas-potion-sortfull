import random
from typing import List, Tuple, Dict, Any

class GameEngine:
    COLORS = [
        'red', 'blue', 'green', 'yellow', 
        'purple', 'orange', 'cyan', 'pink',
        'lime', 'magenta', 'teal', 'coral'
    ]
    
    def generate_level(self, level_id: int) -> Dict[str, Any]:
        """Generate a level with proper difficulty scaling"""
        
        # Determine number of colors based on level
        if level_id <= 3:
            num_colors = 2  # 2 colors = easy
        elif level_id <= 8:
            num_colors = 3  # 3 colors
        elif level_id <= 15:
            num_colors = 4  # 4 colors
        elif level_id <= 25:
            num_colors = 5  # 5 colors
        elif level_id <= 35:
            num_colors = 6  # 6 colors
        else:
            num_colors = min(7 + (level_id - 35) // 5, 12)  # Up to 12 colors
        
        # Select colors for this level
        colors = random.sample(self.COLORS, num_colors)
        
        # Create exactly 4 pieces of each color
        all_pieces = []
        for color in colors:
            all_pieces.extend([color] * 4)  # Exactly 4 of each color!
        
        # Shuffle pieces
        random.shuffle(all_pieces)
        
        # Number of bottles = colors + 2 empty bottles for maneuvering
        num_bottles = num_colors + 2
        
        # Distribute pieces into bottles (4 per bottle max)
        bottles = []
        pieces_per_bottle = 4
        
        # Fill bottles
        for i in range(num_colors):
            start_idx = i * pieces_per_bottle
            end_idx = start_idx + pieces_per_bottle
            bottles.append(all_pieces[start_idx:end_idx])
        
        # Add empty bottles
        for _ in range(2):
            bottles.append([])
        
        # Shuffle bottles so empty ones aren't always at the end
        random.shuffle(bottles)
        
        # Calculate optimal moves (rough estimate)
        optimal_moves = num_colors * 3 + level_id // 5
        
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
        
        # Get the color to pour (top color of source bottle)
        color_to_pour = from_bottle[-1]
        
        # If target is not empty, colors must match
        if to_bottle and to_bottle[-1] != color_to_pour:
            return False, bottles
        
        # Count how many of the same color on top of source
        count = 1
        for i in range(len(from_bottle) - 2, -1, -1):
            if from_bottle[i] == color_to_pour:
                count += 1
            else:
                break
        
        # Calculate how many we can pour
        space_available = 4 - len(to_bottle)
        pour_count = min(count, space_available)
        
        # Execute the pour
        new_bottles = [bottle[:] for bottle in bottles]  # Deep copy
        
        for _ in range(pour_count):
            new_bottles[to_idx].append(new_bottles[from_idx].pop())
        
        return True, new_bottles
    
    def check_completion(self, bottles: List[List[str]]) -> bool:
        """Check if the level is completed"""
        for bottle in bottles:
            # Skip empty bottles
            if not bottle:
                continue
            
            # Bottle must be full (4 colors) and all same color
            if len(bottle) != 4:
                return False
            
            if not all(color == bottle[0] for color in bottle):
                return False
        
        return True

game_engine = GameEngine()
