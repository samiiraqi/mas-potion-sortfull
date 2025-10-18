from pydantic import BaseModel
from typing import List

class Level(BaseModel):
    level_id: int
    bottles: List[List[str]]
    max_capacity: int = 4
    optimal_moves: int = 20

class MoveRequest(BaseModel):
    bottles: List[List[str]]
    from_bottle: int
    to_bottle: int

class MoveResponse(BaseModel):
    success: bool
    bottles: List[List[str]]
    is_completed: bool
    message: str
