extends Node2D

@export var bottle_colors: Array = []
@export var max_capacity: int = 4

var liquid_layers: Array = []

signal bottle_clicked(bottle)

func _ready():
	if has_node("Sprite2D"):
		$Sprite2D.visible = false
	setup_bottle_visual()
	call_deferred("update_liquid_display")

func setup_bottle_visual():
	var area = $Area2D
	area.input_pickable = true
	
	var collision = $Area2D/CollisionShape2D
	var shape = RectangleShape2D.new()
	shape.size = Vector2(60, 160)
	collision.shape = shape
	
	if not area.input_event.is_connected(_on_area_input_event):
		area.input_event.connect(_on_area_input_event)
	
	# Draw beautiful glass bottle outline
	draw_bottle_outline()

func draw_bottle_outline():
	# Glass bottle shape
	var bottle_outline = ColorRect.new()
	bottle_outline.size = Vector2(54, 145)
	bottle_outline.position = Vector2(-27, -72)
	bottle_outline.color = Color(1, 1, 1, 0.15)
	bottle_outline.mouse_filter = Control.MOUSE_FILTER_IGNORE
	bottle_outline.z_index = 10
	add_child(bottle_outline)
	
	# Glass shine
	var shine = ColorRect.new()
	shine.size = Vector2(12, 120)
	shine.position = Vector2(-20, -60)
	shine.color = Color(1, 1, 1, 0.3)
	shine.mouse_filter = Control.MOUSE_FILTER_IGNORE
	shine.z_index = 20
	add_child(shine)

func update_liquid_display():
	for layer in liquid_layers:
		if is_instance_valid(layer):
			layer.queue_free()
	liquid_layers.clear()
	
	await get_tree().process_frame
	
	if bottle_colors.is_empty():
		return
	
	# Beautiful liquid layers
	var layer_height = 35.0
	var start_y = 70.0
	
	for i in range(bottle_colors.size()):
		var liquid = ColorRect.new()
		liquid.size = Vector2(50, layer_height)
		liquid.position = Vector2(-25, start_y - (i + 1) * layer_height)
		liquid.color = bottle_colors[i]
		liquid.color.a = 0.9  # Slightly transparent
		liquid.mouse_filter = Control.MOUSE_FILTER_IGNORE
		liquid.z_index = 5
		add_child(liquid)
		liquid_layers.append(liquid)
		
		# Add liquid shine
		var liquid_shine = ColorRect.new()
		liquid_shine.size = Vector2(10, layer_height - 4)
		liquid_shine.position = Vector2(-20, start_y - (i + 1) * layer_height + 2)
		liquid_shine.color = Color(1, 1, 1, 0.2)
		liquid_shine.mouse_filter = Control.MOUSE_FILTER_IGNORE
		liquid_shine.z_index = 6
		add_child(liquid_shine)
		liquid_layers.append(liquid_shine)

func _on_area_input_event(_viewport, event, _shape_idx):
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
			bottle_clicked.emit(self)

func can_pour_into(other_bottle) -> bool:
	if bottle_colors.is_empty():
		return false
	if other_bottle.bottle_colors.size() >= max_capacity:
		return false
	if other_bottle.bottle_colors.is_empty():
		return true
	return bottle_colors.back() == other_bottle.bottle_colors.back()

func pour_to(other_bottle) -> bool:
	if can_pour_into(other_bottle):
		var color = bottle_colors.pop_back()
		other_bottle.bottle_colors.append(color)
		call_deferred("update_liquid_display")
		other_bottle.call_deferred("update_liquid_display")
		return true
	return false
