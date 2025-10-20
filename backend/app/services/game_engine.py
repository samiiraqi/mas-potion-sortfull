import random
from typing import List, Tuple, Dict, Any

class GameEngine:
    COLORS = [
        'red', 'blue', 'green', 'yellow', 
        'purple', 'orange', 'cyan', 'pink',
        'lime', 'magenta', 'teal', 'coral'
    ]
    
    def generate_level(self, level_id: int) -> Dict[str, Any]:
        """Generate a level with AGGRESSIVE difficulty - fewer empty bottles!"""
        
        # HARDCORE difficulty scaling with FEWER empty bottles
        if level_id <= 3:
            num_colors = 3
            num_empty = 2  # Start with 2 empty (beginner friendly)
        elif level_id <= 8:
            num_colors = 4
            num_empty = 2  # Still 2 empty
        elif level_id <= 12:
            num_colors = 5
            num_empty = 2  # Getting harder
        elif level_id <= 18:
            num_colors = 6
            num_empty = 2  # Medium difficulty
        elif level_id <= 25:
            num_colors = 7
            num_empty = 2  # Hard - you need to think!
        elif level_id <= 32:
            num_colors = 8
            num_empty = 2  # Very hard
        elif level_id <= 38:
            num_colors = 9
            num_empty = 2  # Expert
        elif level_id <= 44:
            num_colors = 10
            num_empty = 2  # Master
        else:
            num_colors = min(11 + (level_id - 44), 12)
            num_empty = 2  # INSANE - only 2 empty with 12 colors!
        
        # Select colors
        colors = random.sample(self.COLORS, num_colors)
        
        # Create exactly 4 pieces of each color
        all_pieces = []
        for color in colors:
            all_pieces.extend([color] * 4)
        
        # MAXIMUM CHAOS - shuffle multiple times
        for _ in range(7):  # 7 shuffles for extreme mixing!
            random.shuffle(all_pieces)
        
        # Create bottles
        bottles = []
        
        # Fill bottles with 4 pieces each (completely random distribution)
        temp_bottles = [[] for _ in range(num_colors)]
        
        # Randomly distribute all pieces
        piece_index = 0
        for bottle_idx in range(num_colors):
            for _ in range(4):
                if piece_index < len(all_pieces):
                    temp_bottles[bottle_idx].append(all_pieces[piece_index])
                    piece_index += 1
        
        # Shuffle each bottle internally for maximum chaos
        for bottle in temp_bottles:
            random.shuffle(bottle)
        
        bottles.extend(temp_bottles)
        
        # Add empty bottles
        for _ in range(num_empty):
            bottles.append([])
        
        # Final shuffle of bottle order
        random.shuffle(bottles)
        
        # Calculate optimal moves (higher for complex levels)
        optimal_moves = num_colors * 5 + level_id
        
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
