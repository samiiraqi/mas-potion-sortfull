const express = require('express');
const cors = require('cors');
const levels = require('./levels.json');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - Allow frontend domain
app.use(cors({
  origin: [
    'https://water-sort-frontend.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

// Get specific level
app.get('/api/v1/levels/:id', (req, res) => {
  const levelId = req.params.id;
  const level = levels[levelId];
  
  if (!level) {
    return res.status(404).json({ error: 'Level not found' });
  }
  
  res.json(level);
});

// Get all levels
app.get('/api/v1/levels', (req, res) => {
  res.json(levels);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('CORS enabled for frontend domains');
});
