from pydantic import BaseModel
from typing import List
from enum import Enum

class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class Level(BaseModel):
    level_id: int
    difficulty: DifficultyLevel
    bottles: List[List[str]]
    num_colors: int
    num_bottles: int
    max_moves: int
