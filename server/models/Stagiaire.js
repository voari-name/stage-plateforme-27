
const mongoose = require('mongoose');

const StagiaireSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  etablissement: {
    type: String,
    required: true
  },
  formation: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'upcoming'],
    default: 'active'
  },
  dateDebut: {
    type: String,
    required: true
  },
  dateFin: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stagiaire', StagiaireSchema);
