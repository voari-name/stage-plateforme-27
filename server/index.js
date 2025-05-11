
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const stagiairesRoutes = require('./routes/stagiaires');
const evaluationsRoutes = require('./routes/evaluations');
const missionsRoutes = require('./routes/missions');
const { initAdminUser } = require('./utils/initDb');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourproductionurl.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connection status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    server: 'running', 
    database: dbStatus,
    timestamp: new Date().toISOString() 
  });
});

// Connect to MongoDB with improved error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize admin user after successful connection
    initAdminUser();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stagiaires', stagiairesRoutes);
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/missions', missionsRoutes);

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  
  // Send appropriate error response based on the error type
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Erreur de validation des données', 
      details: err.message 
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Non autorisé: token manquant ou invalide' });
  }
  
  // Default server error
  res.status(500).json({ 
    message: 'Une erreur est survenue sur le serveur',
    requestId: req.id // Useful for tracking the error in logs
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: `Route non trouvée: ${req.originalUrl}` });
});

// Start server with improved logging
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API endpoints available at: http://localhost:${PORT}/api/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to exit the process and let a process manager restart it
  // process.exit(1);
});
