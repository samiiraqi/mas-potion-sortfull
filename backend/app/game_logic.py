from typing import List, Dict, Any
import json
import os

# Load levels from JSON file
LEVELS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'levels.json')

# Color mapping
HEX_TO_NAME = {
    "#FF0000": "red",
    "#00FF00": "green", 
    "#0000FF": "blue",
    "#FFFF00": "yellow",
    "#FFA500": "orange",
    "#800080": "purple",
    "#FFC0CB": "pink",
    "#00FFFF": "cyan",
    "#A52A2A": "brown",
    "#FFD700": "gold",
    "#C0C0C0": "silver",
    "#000000": "black",
    "#FFFFFF": "white",
}

def load_levels():
    """Load all levels from levels.json"""
    try:
        with open(LEVELS_FILE, 'r') as f:
            data = json.load(f)
            print(f"✅ Loaded levels.json with {len(data)} levels")
            
            # Convert string keys to integers and hex to color names
            levels_dict = {}
            for key, value in data.items():
                level_id = int(key)
                # Convert hex colors to names
                bottles = []
                for bottle in value.get('bottles', []):
                    converted_bottle = []
                    for color in bottle:
                        color_name = HEX_TO_NAME.get(color, color)
                        converted_bottle.append(color_name)
                    bottles.append(converted_bottle)
                
                levels_dict[level_id] = {
                    'level_id': level_id,
                    'bottles': bottles
                }
            
            return levels_dict
    except Exception as e:
        print(f"❌ Error loading levels.json: {e}")
        import traceback
        traceback.print_exc()
        return {}

# Load levels on startup
LEVELS_DATA = load_levels()
print(f"✅ Successfully loaded {len(LEVELS_DATA)} levels")

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
    
    if not can_pour(from_bottle, to_bottle):
        return {
            "success": False,
            "bottles": bottles,
            "is_completed": False
        }
    
    color_to_pour = from_bottle[-1]
    
    # Count matching colors on top
    colors_poured = 0
    for i in range(len(from_bottle) - 1, -1, -1):
        if from_bottle[i] == color_to_pour:
            colors_poured += 1
        else:
            break
    
    # Limit by space
    available_space = 4 - len(to_bottle)
    colors_to_pour = min(colors_poured, available_space)
    
    # Create new bottles state
    new_bottles = [bottle[:] for bottle in bottles]
    
    # Pour the colors
    for _ in range(colors_to_pour):
        new_bottles[to_idx].append(new_bottles[from_idx].pop())
    
    # Check if completed
    is_completed = check_completion(new_bottles)
    
    return {
        "success": True,
        "bottles": new_bottles,
        "is_completed": is_completed
    }

def check_completion(bottles: List[List[str]]) -> bool:
    """Check if puzzle is completed"""
    for bottle in bottles:
        if len(bottle) == 0:
            continue
        
        if len(bottle) != 4:
            return False
        
        if not all(color == bottle[0] for color in bottle):
            return False
    
    return True

def validate_move(bottles: List[List[str]], from_idx: int, to_idx: int) -> tuple[bool, List[List[str]]]:
    """Validate and execute a move"""
    if from_idx < 0 or from_idx >= len(bottles):
        return False, bottles
    
    if to_idx < 0 or to_idx >= len(bottles):
        return False, bottles
    
    if from_idx == to_idx:
        return False, bottles
    
    result = pour_liquid(bottles, from_idx, to_idx)
    
    return result["success"], result["bottles"]

def generate_level(level_id: int) -> Dict[str, Any]:
    """Get level from levels.json"""
    
    if level_id in LEVELS_DATA:
        level = LEVELS_DATA[level_id]
        return {
            "level_id": level_id,
            "bottles": level["bottles"],
            "max_capacity": 4
        }
    
    # Fallback: generate procedurally
    print(f"⚠️ Level {level_id} not in levels.json, generating...")
    
    if level_id <= 10:
        num_colors = 3
        num_bottles = 5
    elif level_id <= 30:
        num_colors = 4
        num_bottles = 6
    elif level_id <= 60:
        num_colors = 5
        num_bottles = 7
    elif level_id <= 90:
        num_colors = 6
        num_bottles = 8
    else:
        num_colors = 7
        num_bottles = 9
    
    colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan", "brown"][:num_colors]
    bottles = []
    
    all_pieces = []
    for color in colors:
        all_pieces.extend([color] * 4)
    
    import random
    random.seed(level_id)
    random.shuffle(all_pieces)
    
    for i in range(num_colors):
        bottle = all_pieces[i*4:(i+1)*4]
        bottles.append(bottle)
    
    for _ in range(num_bottles - num_colors):
        bottles.append([])
    
    return {
        "level_id": level_id,
        "bottles": bottles,
        "max_capacity": 4
    }
