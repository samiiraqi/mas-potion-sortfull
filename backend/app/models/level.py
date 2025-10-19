from typing import List
from pydantic import BaseModel

class Level(BaseModel):
    level_id: int
    bottles: List[List[str]]
    optimal_moves: int
