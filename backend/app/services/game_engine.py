import random
from typing import List, Tuple
from app.models.game import Level, DifficultyLevel

class GameEngine:
    def __init__(self):
        self.bottle_capacity = 4
        self.colors = ["red", "blue", "green", "purple", "yellow", "orange", "cyan", "pink", "lime", "magenta", "teal", "coral"]
    
    def generate_level(self, level_id: int) -> Level:
        """Generate level with proper row layout"""
        if level_id <= 50:
            difficulty = DifficultyLevel.EASY
            num_rows = 3  # 3 rows
            num_colors = 5
        elif level_id <= 150:
            difficulty = DifficultyLevel.MEDIUM
            num_rows = 4  # 4 rows
            num_colors = 7
        else:
            difficulty = DifficultyLevel.HARD
            num_rows = 5  # 5 rows
            num_colors = 9
        
        bottles = self._create_bottles_grid(num_colors, num_rows)
        
        return Level(
            level_id=level_id,
            difficulty=difficulty,
            bottles=bottles,
            num_colors=num_colors,
            num_bottles=len(bottles),
            max_moves=(num_rows * 7) * 15
        )
    
    def _create_bottles_grid(self, num_colors: int, num_rows: int) -> List[List[str]]:
        """
        Create grid:
        - Row 1: 7 filled
        - Row 2: 7 filled
        - Row 3: 2 empty + 5 filled
        - Row 4+: 7 filled
        
        Total filled bottles = (num_rows * 7) - 2
        """
        colors = self.colors[:num_colors]
        
        total_filled = (num_rows * 7) - 2  # -2 for the 2 empty bottles
        total_segments = total_filled * self.bottle_capacity
        
        # Create segments - distribute colors evenly
        all_segments = []
        segments_per_color = total_segments // num_colors
        remainder = total_segments % num_colors
        
        for i, color in enumerate(colors):
            count = segments_per_color + (1 if i < remainder else 0)
            all_segments.extend([color] * count)
        
        # Shuffle
        random.shuffle(all_segments)
        
        # Build bottles row by row
        bottles = []
        segment_idx = 0
        
        for row in range(num_rows):
            if row == 2:  # Row 3 (0-indexed as 2)
                # Add 2 empty bottles first
                bottles.append([])
                bottles.append([])
                
                # Then add 5 filled bottles
                for _ in range(5):
                    bottle = all_segments[segment_idx:segment_idx + self.bottle_capacity]
                    bottles.append(bottle)
                    segment_idx += self.bottle_capacity
            else:
                # Regular row: 7 filled bottles
                for _ in range(7):
                    bottle = all_segments[segment_idx:segment_idx + self.bottle_capacity]
                    bottles.append(bottle)
                    segment_idx += self.bottle_capacity
        
        return bottles
    
    def is_move_valid(self, bottles: List[List[str]], from_idx: int, to_idx: int) -> Tuple[bool, str]:
        if from_idx < 0 or from_idx >= len(bottles):
            return False, "Invalid source"
        if to_idx < 0 or to_idx >= len(bottles):
            return False, "Invalid target"
        if from_idx == to_idx:
            return False, "Same bottle"
        
        source = bottles[from_idx]
        target = bottles[to_idx]
        
        if not source:
            return False, "Source is empty"
        if len(target) >= self.bottle_capacity:
            return False, "Target is full"
        if not target:
            return True, "Valid - empty target"
        if source[-1] != target[-1]:
            return False, "Colors don't match"
        
        return True, "Valid"
    
    def make_move(self, bottles: List[List[str]], from_idx: int, to_idx: int) -> Tuple[List[List[str]], bool]:
        is_valid, _ = self.is_move_valid(bottles, from_idx, to_idx)
        if not is_valid:
            return bottles, False
        
        new_bottles = [bottle[:] for bottle in bottles]
        color = new_bottles[from_idx].pop()
        new_bottles[to_idx].append(color)
        
        return new_bottles, True
    
    def is_level_complete(self, bottles: List[List[str]]) -> bool:
        for bottle in bottles:
            if not bottle:
                continue
            if len(bottle) != self.bottle_capacity:
                return False
            if len(set(bottle)) != 1:
                return False
        return True

game_engine = GameEngine()
