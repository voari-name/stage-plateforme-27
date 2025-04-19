
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mission = require('../models/Mission');
const Stagiaire = require('../models/Stagiaire');

// @route   GET api/missions
// @desc    Get all missions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const missions = await Mission.find()
      .populate('stagiaires', 'nom prenom avatar')
      .sort({ createdAt: -1 });
    res.json(missions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/missions/:id
// @desc    Get mission by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate('stagiaires', 'nom prenom avatar');
    
    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    
    res.json(mission);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/missions/stagiaire/:stagiaireId
// @desc    Get missions by stagiaire ID
// @access  Private
router.get('/stagiaire/:stagiaireId', auth, async (req, res) => {
  try {
    const missions = await Mission.find({ stagiaires: req.params.stagiaireId })
      .populate('stagiaires', 'nom prenom avatar')
      .sort({ dateDebut: -1 });
    res.json(missions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/missions
// @desc    Create a mission
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    titre,
    description,
    status,
    dateDebut,
    dateFin,
    progress,
    departement,
    stagiaires
  } = req.body;

  try {
    // Check if all stagiaires exist
    if (stagiaires && stagiaires.length > 0) {
      for (const stagiaireId of stagiaires) {
        const stagiaireExists = await Stagiaire.findById(stagiaireId);
        if (!stagiaireExists) {
          return res.status(404).json({ message: `Stagiaire avec l'ID ${stagiaireId} non trouvé` });
        }
      }
    }

    const newMission = new Mission({
      titre,
      description,
      status,
      dateDebut,
      dateFin,
      progress,
      departement,
      stagiaires: stagiaires || []
    });

    const mission = await newMission.save();
    
    // Populate stagiaires data before returning
    await mission.populate('stagiaires', 'nom prenom avatar');
    
    res.json(mission);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/missions/:id
// @desc    Update a mission
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    titre,
    description,
    status,
    dateDebut,
    dateFin,
    progress,
    departement,
    stagiaires
  } = req.body;

  // Build mission object
  const missionFields = {};
  if (titre) missionFields.titre = titre;
  if (description) missionFields.description = description;
  if (status) missionFields.status = status;
  if (dateDebut) missionFields.dateDebut = dateDebut;
  if (dateFin) missionFields.dateFin = dateFin;
  if (progress !== undefined) missionFields.progress = progress;
  if (departement) missionFields.departement = departement;
  
  // Check if stagiaires are being updated
  if (stagiaires) {
    // Check if all stagiaires exist
    for (const stagiaireId of stagiaires) {
      const stagiaireExists = await Stagiaire.findById(stagiaireId);
      if (!stagiaireExists) {
        return res.status(404).json({ message: `Stagiaire avec l'ID ${stagiaireId} non trouvé` });
      }
    }
    missionFields.stagiaires = stagiaires;
  }

  try {
    let mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    // Update
    mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { $set: missionFields },
      { new: true }
    ).populate('stagiaires', 'nom prenom avatar');

    res.json(mission);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/missions/:id/assign
// @desc    Assign stagiaires to a mission
// @access  Private
router.post('/:id/assign', auth, async (req, res) => {
  const { stagiaires } = req.body;

  try {
    let mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    // Check if all stagiaires exist
    for (const stagiaireId of stagiaires) {
      const stagiaireExists = await Stagiaire.findById(stagiaireId);
      if (!stagiaireExists) {
        return res.status(404).json({ message: `Stagiaire avec l'ID ${stagiaireId} non trouvé` });
      }
    }

    // Update stagiaires
    mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { $set: { stagiaires } },
      { new: true }
    ).populate('stagiaires', 'nom prenom avatar');

    res.json(mission);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/missions/:id/progress
// @desc    Update mission progress
// @access  Private
router.put('/:id/progress', auth, async (req, res) => {
  const { progress } = req.body;

  try {
    let mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    // Update progress
    const updateData = { progress };
    
    // Automatically update status based on progress
    if (progress === 0) {
      updateData.status = 'not_started';
    } else if (progress === 100) {
      updateData.status = 'completed';
    } else if (progress > 0 && progress < 100) {
      updateData.status = 'in_progress';
    }

    mission = await Mission.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('stagiaires', 'nom prenom avatar');

    res.json(mission);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/missions/:id
// @desc    Delete a mission
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }

    await mission.deleteOne();
    res.json({ message: 'Mission supprimée' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Mission non trouvée' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
