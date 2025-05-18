
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modelisation selon la structure MySQL visible dans l'image
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  // Les champs supplémentaires peuvent être ajoutés selon les besoins
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    brightness: {
      type: Number,
      min: 50,
      max: 150,
      default: 100
    }
  }
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Middleware pre-save pour hacher les mots de passe
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
