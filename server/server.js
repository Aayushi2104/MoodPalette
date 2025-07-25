const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const paletteRoutes = require('./routes/palette');
const aiRoutes = require('./routes/ai');
const authRoutes = require('./routes/auth');

const app = express();

// CORS configuration using environment variables
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI).then(()=>{
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
}
);

app.use('/palette', paletteRoutes);
app.use('/ai', aiRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'MoodPalette API running',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Health check endpoint for hosting platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
