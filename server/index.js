const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const stagiairesRoutes = require('./routes/stagiaires');
const evaluationsRoutes = require('./routes/evaluations');
const missionsRoutes = require('./routes/missions');
const { initAdminUser } = require('./utils/initAdminUser'); // Aza adino fa io no tokony ho ilay file, raha "initDb.js" ilay anao dia asio fanitsiana

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize admin user after successful connection
    initAdminUser();  // Anisan'ny hanombohana ny famoronana admin raha tsy mbola misy
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stagiaires', stagiairesRoutes);
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/missions', missionsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});