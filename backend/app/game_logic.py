from typing import List, Dict, Any

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
    
    # Get top color
    color_to_pour = from_bottle[-1]
    print(f"   🎨 Top color: {color_to_pour}")
    
    # Count matching colors on top
    colors_poured = 0
    for i in range(len(from_bottle) - 1, -1, -1):
        if from_bottle[i] == color_to_pour:
            colors_poured += 1
        else:
            break
    
    print(f"   📊 Found {colors_poured} matching colors stacked on top")
    
    # Limit by space
    available_space = 4 - len(to_bottle)
    colors_to_pour = min(colors_poured, available_space)
    
    print(f"   📦 Available space in target: {available_space}")
    print(f"   ✅ Will pour {colors_to_pour} colors")
    
    # Pour them!
    for _ in range(colors_to_pour):
        color = from_bottle.pop()
        to_bottle.append(color)
    
    print(f"   AFTER - FROM: {from_bottle}")
    print(f"   AFTER - TO: {to_bottle}")
    
    is_completed = check_win_condition(bottles)
    
    return {
        "success": True,
        "bottles": bottles,
        "is_completed": is_completed,
        "colors_poured": colors_to_pour
    }

def check_win_condition(bottles: List[List[str]]) -> bool:
    """Check if puzzle is solved"""
    for bottle in bottles:
        if len(bottle) == 0:
            continue
        
        if len(bottle) != 4:
            return False
        
        if not all(color == bottle[0] for color in bottle):
            return False
    
    return True

def generate_level(level_id: int) -> Dict[str, Any]:
    """Generate levels"""
    levels = {
        1: {
            "bottles": [
                ["red", "blue", "red"],
                ["blue", "green", "blue"],
                ["green", "red", "green"],
                [],
                []
            ]
        },
        2: {
            "bottles": [
                ["red", "red", "blue", "green"],
                ["blue", "blue", "green", "red"],
                ["green", "green", "red", "blue"],
                [],
                []
            ]
        }
    }
    
    level_data = levels.get(level_id, levels[1])
    
    return {
        "level_id": level_id,
        "bottles": level_data["bottles"],
        "max_capacity": 4
    }
