import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gameAPI } from '../../services/api';
import type { Level } from '../../types/game.tsx';

const COLOR_MAP: { [key: string]: string } = {
  red: '#E74C3C',
  blue: '#3498DB',
  green: '#2ECC71',
  purple: '#9B59B6',
  yellow: '#F39C12',
  orange: '#E67E22',
  cyan: '#1ABC9C',
  pink: '#E91E63',
  lime: '#8BC34A',
  magenta: '#9C27B0',
  teal: '#00BCD4',
  coral: '#FF7043'
};

// LIQUID SHADER - Makes water look REAL
const liquidVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    // Wave effect
    vec3 pos = position;
    pos.y += sin(pos.x * 10.0 + time * 3.0) * 0.02;
    pos.y += cos(pos.z * 10.0 + time * 2.5) * 0.02;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const liquidFragmentShader = `
  uniform vec3 liquidColor;
  uniform float time;
  uniform float opacity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    // Fresnel effect for realistic liquid
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(viewDirection, vec3(0.0, 1.0, 0.0)), 2.0);
    
    // Animated ripples
    float ripple = sin(vUv.x * 20.0 + time * 2.0) * 0.1;
    ripple += cos(vUv.y * 20.0 + time * 1.5) * 0.1;
    
    // Color with shine
    vec3 finalColor = liquidColor + vec3(fresnel * 0.3);
    finalColor += vec3(ripple * 0.1);
    
    gl_FragColor = vec4(finalColor, opacity);
  }
`;

interface LiquidProps {
  color: string;
  height: number;
  position: [number, number, number];
}

function Liquid({ color, height, position }: LiquidProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);
  
  useFrame((state, delta) => {
    setTime(t => t + delta);
  });
  
  const colorObj = new THREE.Color(color);
  
  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.45, 0.45, height, 32]} />
      <shaderMaterial
        vertexShader={liquidVertexShader}
        fragmentShader={liquidFragmentShader}
        uniforms={{
          liquidColor: { value: [colorObj.r, colorObj.g, colorObj.b] },
          time: { value: time },
          opacity: { value: 0.85 }
        }}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

interface BottleProps {
  colors: string[];
  position: [number, number, number];
  onSelect: () => void;
  isSelected: boolean;
}

function Bottle({ colors, position, onSelect, isSelected }: BottleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <group position={position}>
      {/* Glass tube */}
      <mesh onClick={onSelect}>
        <cylinderGeometry args={[0.5, 0.5, 4, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
          envMapIntensity={1}
        />
      </mesh>
      
      {/* Bottom cap */}
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.2}
          roughness={0.05}
        />
      </mesh>
      
      {/* Liquids with REAL shader */}
      {colors.map((color, idx) => {
        const layerHeight = 3.5 / 4;
        const yPos = -2 + 0.05 + (idx * layerHeight) + (layerHeight / 2);
        return (
          <Liquid
            key={idx}
            color={COLOR_MAP[color]}
            height={layerHeight}
            position={[0, yPos, 0]}
          />
        );
      })}
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 2.5, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      )}
    </group>
  );
}

function Scene({ bottles, onBottleClick, selectedBottle }: any) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Bottles in grid */}
      {bottles.map((colors: string[], idx: number) => {
        const row = Math.floor(idx / 7);
        const col = idx % 7;
        const x = (col - 3) * 1.5;
        const z = row * 1.5;
        
        return (
          <Bottle
            key={idx}
            colors={colors}
            position={[x, 0, z]}
            onSelect={() => onBottleClick(idx)}
            isSelected={selectedBottle === idx}
          />
        );
      })}
      
      <OrbitControls 
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function WaterSort3D() {
  const [level, setLevel] = useState<Level | null>(null);
  const [bottles, setBottles] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [moves, setMoves] = useState(0);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId]);

  const loadLevel = async (levelId: number) => {
    try {
      setLoading(true);
      const data = await gameAPI.getLevel(levelId);
      setLevel(data);
      setBottles(data.bottles);
      setMoves(0);
      setMessage('');
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBottleClick = (idx: number) => {
    if (selectedBottle === null) {
      if (bottles[idx].length > 0) {
        setSelectedBottle(idx);
      }
    } else {
      if (idx !== selectedBottle) {
        // Try to pour
        const newBottles = [...bottles];
        const from = selectedBottle;
        const to = idx;
        
        if (newBottles[from].length > 0 && newBottles[to].length < 4) {
          const sourceColor = newBottles[from][newBottles[from].length - 1];
          const targetColor = newBottles[to].length > 0 ? newBottles[to][newBottles[to].length - 1] : null;
          
          if (!targetColor || targetColor === sourceColor) {
            const color = newBottles[from].pop();
            if (color) {
              newBottles[to].push(color);
              setBottles(newBottles);
              setMoves(m => m + 1);
              
              // Check win
              const isWin = newBottles.every(b => 
                b.length === 0 || (b.length === 4 && b.every(c => c === b[0]))
              );
              if (isWin) {
                setMessage('🎉 Level Complete!');
              }
            }
          }
        }
      }
      setSelectedBottle(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '2rem'
      }}>
        Loading 3D Scene...
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          color: 'white', 
          margin: '0 0 20px 0',
          textShadow: '0 4px 10px rgba(0,0,0,0.5)'
        }}>
          3D WATER SORT
        </h1>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(10px)',
            padding: '10px 20px', 
            borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>LEVEL</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{currentLevelId}</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            backdropFilter: 'blur(10px)',
            padding: '10px 20px', 
            borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>MOVES</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>{moves}</div>
          </div>
        </div>
        
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #11998e, #38ef7d)',
            borderRadius: '10px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 8px 20px rgba(17, 153, 142, 0.4)'
          }}>
            {message}
          </div>
        )}
      </div>
      
      {/* Buttons */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setCurrentLevelId(p => Math.max(1, p - 1))}
          disabled={currentLevelId === 1}
          style={{
            padding: '12px 25px',
            background: currentLevelId === 1 ? '#555' : 'linear-gradient(135deg, #f093fb, #f5576c)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: currentLevelId === 1 ? 'not-allowed' : 'pointer',
            opacity: currentLevelId === 1 ? 0.5 : 1
          }}
        >
          ← PREV
        </button>
        <button 
          onClick={() => loadLevel(currentLevelId)}
          style={{
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #fa709a, #fee140)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ↻ RESTART
        </button>
        <button 
          onClick={() => setCurrentLevelId(p => p + 1)}
          style={{
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          NEXT →
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 8, 12], fov: 50 }}>
        <Scene 
          bottles={bottles}
          onBottleClick={handleBottleClick}
          selectedBottle={selectedBottle}
        />
      </Canvas>
    </div>
  );
}