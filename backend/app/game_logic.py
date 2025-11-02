from typing import List, Dict, Any
import json
import os
import random

# Load levels from JSON file
def load_levels_from_json():
    """Load all levels from levels.json"""
    json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'levels.json')
    
    if os.path.exists(json_path):
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
                # Convert list to dict keyed by level
                levels_dict = {}
                for level in data:
                    levels_dict[level['level']] = level
                return levels_dict
        except Exception as e:
            print(f"Error loading levels.json: {e}")
            return {}
    return {}

# Load levels at module initialization
LEVELS = load_levels_from_json()

def generate_procedural_level(level_id: int) -> Dict[str, Any]:
    """Generate a procedural level for levels not in JSON"""
    # Calculate difficulty
    num_colors = min(3 + (level_id // 10), 12)  # 3-12 colors
    num_bottles = num_colors + 2  # Always 2 empty bottles
    
    # Color palette
    all_colors = [
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#FFD700",
        "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B500",
        "#FF6F91", "#00D2FF", "#3AA17E", "#FD79A8", "#A29BFE"
    ]
    
    # Select colors for this level
    random.seed(level_id)  # Consistent generation
    colors = all_colors[:num_colors]
    
    # Create bottles - 4 of each color distributed
    bottles = []
    for color in colors:
        bottles.append([color] * 4)
    
    # Shuffle each bottle randomly
    for _ in range(level_id * 3):  # More shuffles for harder levels
        if len(bottles) >= 2:
            i, j = random.sample(range(len(bottles)), 2)
            if bottles[i] and len(bottles[j]) < 4:
                color = bottles[i].pop()
                bottles[j].append(color)
    
    # Add empty bottles
    bottles.extend([[], []])
    
    return {
        "level_id": level_id,
        "bottles": bottles,
        "max_capacity": 4
    }

def generate_level(level_id: int) -> Dict[str, Any]:
    """Generate or load level data"""
    
    # Try to load from JSON first
    if level_id in LEVELS:
        level = LEVELS[level_id]
        return {
            "level_id": level_id,
            "bottles": level.get('bottles', []),
            "max_capacity": 4
        }
    
    # Fall back to procedural generation
    return generate_procedural_level(level_id)

def can_pour(from_bottle: List[str], to_bottle: List[str], max_capacity: int = 4) -> bool:
    """Check if we can pour from one bottle to another"""
    if not from_bottle:
        return False
    
    if len(to_bottle) >= max_capacity:
        return False
    
    if not to_bottle:
        return True
    
    return from_bottle[-1] == to_bottle[-1]

def pour_liquid(bottles: List[List[str]], from_idx: int, to_idx: int) -> Dict[str, Any]:
    """Pour ALL matching colors at once!"""
    from_bottle = bottles[from_idx]
    to_bottle = bottles[to_idx]
    
    print(f"\n🔵 POURING from bottle {from_idx} to bottle {to_idx}")
    print(f"   FROM: {from_bottle}")
    print(f"   TO: {to_bottle}")
    
    if not can_pour(from_bottle, to_bottle):
        print("   ❌ Cannot pour - invalid move")
        return {
            "success": False,
            "bottles": bottles,
            "is_completed": False
        }
    
    color_to_pour = from_bottle[-1]
    print(f"   🎨 Top color: {color_to_pour}")
    
    colors_poured = 0
    for i in range(len(from_bottle) - 1, -1, -1):
        if from_bottle[i] == color_to_pour:
            colors_poured += 1
        else:
            break
    
    print(f"   📊 Found {colors_poured} matching colors stacked on top")
    
    available_space = 4 - len(to_bottle)
    colors_to_pour = min(colors_poured, available_space)
    
    print(f"   ✅ Pouring {colors_to_pour} colors")
    
    new_bottles = [bottle[:] for bottle in bottles]
    
    for _ in range(colors_to_pour):
        color = new_bottles[from_idx].pop()
        new_bottles[to_idx].append(color)
    
    print(f"   RESULT FROM: {new_bottles[from_idx]}")
    print(f"   RESULT TO: {new_bottles[to_idx]}")
    
    is_completed = check_completion(new_bottles)
    
    return {
        "success": True,
        "bottles": new_bottles,
        "is_completed": is_completed
    }

def validate_move(bottles: List[List[str]], from_idx: int, to_idx: int) -> tuple:
    """Validate and execute a move"""
    if from_idx < 0 or from_idx >= len(bottles):
        return False, bottles
    
    if to_idx < 0 or to_idx >= len(bottles):
        return False, bottles
    
    if from_idx == to_idx:
        return False, bottles
    
    result = pour_liquid(bottles, from_idx, to_idx)
    
    if result["success"]:
        return True, result["bottles"]
    
    return False, bottles

def check_completion(bottles: List[List[str]]) -> bool:
    """Check if puzzle is solved"""
    for bottle in bottles:
        if len(bottle) == 0:
            continue
        
        if len(bottle) != 4:
            return False
        
        if not all(color == bottle[0] for color in bottle):
            return False
    
    return True
