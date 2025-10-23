const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Load levels from file
let levels = {};
try {
  const levelsPath = path.join(__dirname, 'levels.json');
  const levelsData = fs.readFileSync(levelsPath, 'utf8');
  levels = JSON.parse(levelsData);
  console.log('✅ Loaded', Object.keys(levels).length, 'levels');
  console.log('✅ Level 1 has', levels['1'].bottles.length, 'bottles');
} catch (err) {
  console.error('❌ Error loading levels:', err);
}

// In-memory storage for multiplayer rooms
const rooms = new Map();

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Potion Sort Backend Running! 🧪',
    totalLevels: Object.keys(levels).length,
    bottlesPerLevel: levels['1'] ? levels['1'].bottles.length : 0
  });
});

// Get specific level
app.get('/api/v1/levels/:id', (req, res) => {
  const levelId = req.params.id;
  const level = levels[levelId];
  
  if (!level) {
    return res.status(404).json({ error: 'Level not found' });
  }
  
  res.json(level);
});

// Get all levels (for level select)
app.get('/api/v1/levels', (req, res) => {
  res.json(levels);
});

// MULTIPLAYER ENDPOINTS
app.post('/api/v1/multiplayer/create', (req, res) => {
  const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const playerId = uuidv4();
  
  // Get a random level for multiplayer
  const levelIds = Object.keys(levels);
  const randomLevelId = levelIds[Math.floor(Math.random() * levelIds.length)];
  const level = levels[randomLevelId];
  
  const room = {
    room_id: roomId,
    players: [{ id: playerId, moves: 0 }],
    level_id: parseInt(randomLevelId),
    bottles: JSON.parse(JSON.stringify(level.bottles)),
    created_at: Date.now(),
    state: 'waiting'
  };
  
  rooms.set(roomId, room);
  
  res.json({
    room_id: roomId,
    player_id: playerId,
    bottles: room.bottles,
    level_id: room.level_id,
    room_state: room.state
  });
});

app.post('/api/v1/multiplayer/join/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  if (room.players.length >= 2) {
    return res.status(400).json({ error: 'Room is full' });
  }
  
  const playerId = uuidv4();
  room.players.push({ id: playerId, moves: 0 });
  room.state = 'playing';
  
  res.json({
    room_id: roomId,
    player_id: playerId,
    bottles: room.bottles,
    level_id: room.level_id,
    room_state: room.state
  });
});

app.get('/api/v1/multiplayer/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json(room);
});

app.post('/api/v1/multiplayer/move/:roomId', (req, res) => {
  const { roomId } = req.params;
  const { player_id, from, to, bottles: newBottles } = req.body;
  
  const room = rooms.get(roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  const player = room.players.find(p => p.id === player_id);
  if (player) {
    player.moves++;
  }
  
  res.json({ success: true, room_state: room });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 Loaded ${Object.keys(levels).length} levels`);
  console.log(`🎮 Each level has ${levels['1'] ? levels['1'].bottles.length : 0} bottles`);
});
