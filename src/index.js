require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const counterRoutes = require('./routes/counter');
const badgeRoutes = require('./routes/badge');

const app = express();
const PORT = process.env.PORT || 3000;

// Create a more flexible CORS configuration for local networks
const corsOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];

// Middleware
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    // First check exact matches
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Then check wildcard patterns (for local networks)
    const wildcardPatterns = corsOrigins.filter(pattern => pattern.includes('*'));
    
    for (const pattern of wildcardPatterns) {
      const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(origin)) {
        return callback(null, true);
      }
    }
    
    callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  methods: ['GET'],
  credentials: true
}));

// Routes
app.use('/api/counter', counterRoutes);
app.use('/api/badge', badgeRoutes);

// Enhanced health check endpoints
app.get('/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Basic system info
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.status(200).json({
      status: 'OK',
      uptime: `${Math.floor(uptime / 60)} minutes, ${Math.floor(uptime % 60)} seconds`,
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// Simple health check endpoint for load balancers and monitoring tools
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
