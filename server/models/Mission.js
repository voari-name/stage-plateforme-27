
const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  dateDebut: {
    type: String,
    required: true
  },
  dateFin: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  departement: {
    type: String,
    required: true
  },
  stagiaires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stagiaire'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mission', MissionSchema);
