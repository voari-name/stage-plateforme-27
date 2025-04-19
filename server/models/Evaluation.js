
const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  stagiaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stagiaire',
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);
