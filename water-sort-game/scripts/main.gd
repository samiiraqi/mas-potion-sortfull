extends Node2D

var bottle_scene = preload("res://scenes/bottle.tscn")
var bottles: Array = []
var selected_bottle = null
var message_label: Label
var title_label: Label

func _ready():
	setup_beautiful_background()
	setup_ui()
	setup_level()

func setup_beautiful_background():
	# Beautiful gradient background
	var bg = ColorRect.new()
	bg.size = Vector2(1024, 600)
	bg.color = Color(0.25, 0.35, 0.65)
	bg.z_index = -100
	add_child(bg)
	
	# Add decorative circles
	for i in range(5):
		var circle = ColorRect.new()
		circle.size = Vector2(150, 150)
		circle.position = Vector2(randf() * 900, randf() * 500)
		circle.color = Color(1, 1, 1, 0.05)
		circle.z_index = -50
		add_child(circle)

func setup_ui():
	# Beautiful title
	title_label = Label.new()
	title_label.text = "💧 Water Sort Puzzle 💧"
	title_label.position = Vector2(300, 30)
	title_label.add_theme_font_size_override("font_size", 40)
	title_label.add_theme_color_override("font_color", Color.WHITE)
	title_label.z_index = 200
	add_child(title_label)
	
	# Message label
	message_label = Label.new()
	message_label.position = Vector2(250, 520)
	message_label.add_theme_font_size_override("font_size", 24)
	message_label.add_theme_color_override("font_color", Color(1, 1, 0.7))
	message_label.z_index = 200
	add_child(message_label)
	show_message("Click a bottle to select, then click where to pour!")

func setup_level():
	for child in get_children():
		if child != message_label and child != title_label and child.z_index >= 0:
			child.queue_free()
	
	bottles.clear()
	
	var bottle_configs = [
		[Color.RED, Color.RED, Color.BLUE],
		[Color.BLUE, Color.BLUE, Color.GREEN],
		[Color.GREEN, Color.GREEN, Color.RED],
		[],
		[Color.RED, Color.BLUE],
		[]
	]
	
	var positions = [
		Vector2(180, 200),
		Vector2(320, 200),
		Vector2(460, 200),
		Vector2(180, 380),
		Vector2(320, 380),
		Vector2(460, 380)
	]
	
	for i in range(bottle_configs.size()):
		var bottle = bottle_scene.instantiate()
		add_child(bottle)
		bottle.position = positions[i]
		bottle.bottle_colors = bottle_configs[i]
		bottle.bottle_clicked.connect(_on_bottle_clicked)
		bottles.append(bottle)

func show_message(text: String):
	message_label.text = text

func _on_bottle_clicked(bottle):
	var index = bottles.find(bottle)
	
	if selected_bottle == null:
		if not bottle.bottle_colors.is_empty():
			selected_bottle = bottle
			bottle.modulate = Color(1.3, 1.3, 1)
			show_message("✨ Selected! Now click where to pour")
		else:
			show_message("⚠️ Select a bottle with liquid first!")
	else:
		if bottle == selected_bottle:
			selected_bottle.modulate = Color(1, 1, 1)
			selected_bottle = null
			show_message("Deselected - try again!")
		else:
			if selected_bottle.can_pour_into(bottle):
				if selected_bottle.pour_to(bottle):
					show_message("💧 Poured successfully!")
			else:
				show_message("❌ Can't pour there!")
			
			selected_bottle.modulate = Color(1, 1, 1)
			selected_bottle = null
