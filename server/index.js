
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const authRoutes = require('./routes/auth');
const stagiairesRoutes = require('./routes/stagiaires');
const evaluationsRoutes = require('./routes/evaluations');
const missionsRoutes = require('./routes/missions');

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
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ 
      server: 'running', 
      database: 'connected',
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    res.json({ 
      server: 'running', 
      database: 'disconnected',
      timestamp: new Date().toISOString() 
    });
  }
});

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'stage_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Make the database connection available to routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Initialize database with tables if they don't exist
const initDatabase = async () => {
  try {
    // Check if users table exists
    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [process.env.DB_NAME || 'stage_platform']);

    if (tables.length === 0) {
      // Create users table if it doesn't exist
      await db.query(`
        CREATE TABLE users (
          id INT(11) NOT NULL AUTO_INCREMENT,
          username VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP NULL,
          PRIMARY KEY (id),
          UNIQUE KEY unique_username (username),
          UNIQUE KEY unique_email (email)
        )
      `);
      
      console.log('Users table created');
      
      // Create admin user
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await db.query(`
        INSERT INTO users (username, password, email, role)
        VALUES ('admin', ?, 'admin@example.com', 'admin')
      `, [hashedPassword]);
      
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

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
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API endpoints available at: http://localhost:${PORT}/api/`);
  
  // Initialize database
  await initDatabase();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // In production, you might want to exit the process and let a process manager restart it
  // process.exit(1);
});
