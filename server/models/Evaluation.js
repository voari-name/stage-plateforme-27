
const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  stagiaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stagiaire',
    required: true
  },
  evaluateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  notePonctualite: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  noteIntegration: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  noteInitiative: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  noteCompetencesTechniques: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  noteMoyenne: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  commentaire: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'reviewed'],
    default: 'reviewed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pre-save pour mettre à jour updateAt
EvaluationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);
