from pydantic import BaseModel
from typing import List, Optional

class Level(BaseModel):
    level_id: int
    bottles: List[List[str]]
    max_capacity: int = 4
    difficulty: Optional[str] = "easy"
    num_colors: Optional[int] = None
    num_bottles: Optional[int] = None
    max_moves: Optional[int] = None
    
    def __init__(self, **data):
        if 'num_bottles' not in data:
            data['num_bottles'] = len(data.get('bottles', []))
        if 'num_colors' not in data:
            colors = set()
            for bottle in data.get('bottles', []):
                colors.update(bottle)
            data['num_colors'] = len(colors)
        super().__init__(**data)
