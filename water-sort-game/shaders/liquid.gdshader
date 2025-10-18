shader_type canvas_item;

uniform vec4 liquid_color : source_color = vec4(0.2, 0.5, 1.0, 0.9);
uniform float fill_amount : hint_range(0.0, 1.0) = 0.5;
uniform float wave_speed : hint_range(0.0, 5.0) = 2.0;
uniform float wave_amplitude : hint_range(0.0, 0.1) = 0.03;
uniform float time_offset = 0.0;

void fragment() {
    vec2 uv = UV;
    
    // Realistic wave on surface
    float wave = sin(uv.x * 10.0 + TIME * wave_speed + time_offset) * wave_amplitude;
    wave += cos(uv.x * 7.0 - TIME * wave_speed * 0.7 + time_offset) * wave_amplitude * 0.5;
    
    float fill_line = 1.0 - fill_amount + wave;
    
    if (uv.y > fill_line) {
        // Glass shine
        float shine = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x) * 0.4;
        
        // Edge glow (fresnel effect)
        float edge_glow = pow(1.0 - abs(uv.x - 0.5) * 2.0, 3.0) * 0.3;
        
        // Side highlights
        float side_light = pow(uv.x, 2.0) * 0.2 + pow(1.0 - uv.x, 2.0) * 0.2;
        
        vec4 final_color = liquid_color;
        final_color.rgb += vec3(shine + edge_glow + side_light);
        
        // Depth gradient
        float depth = (uv.y - fill_line) / (1.0 - fill_line);
        final_color.rgb *= 1.0 - depth * 0.4;
        
        COLOR = final_color;
    } else {
        COLOR = vec4(0.0);
    }
}
