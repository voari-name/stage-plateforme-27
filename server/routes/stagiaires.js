
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Stagiaire = require('../models/Stagiaire');

// @route   GET api/stagiaires
// @desc    Get all stagiaires
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const stagiaires = await Stagiaire.find().sort({ createdAt: -1 });
    res.json(stagiaires);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/stagiaires/:id
// @desc    Get stagiaire by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id);
    
    if (!stagiaire) {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }
    
    res.json(stagiaire);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/stagiaires
// @desc    Create a stagiaire
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    nom,
    prenom,
    email,
    telephone,
    etablissement,
    formation,
    avatar,
    status,
    dateDebut,
    dateFin
  } = req.body;

  try {
    const newStagiaire = new Stagiaire({
      nom,
      prenom,
      email,
      telephone,
      etablissement,
      formation,
      avatar,
      status,
      dateDebut,
      dateFin
    });

    const stagiaire = await newStagiaire.save();
    res.json(stagiaire);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/stagiaires/:id
// @desc    Update a stagiaire
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    nom,
    prenom,
    email,
    telephone,
    etablissement,
    formation,
    avatar,
    status,
    dateDebut,
    dateFin
  } = req.body;

  // Build stagiaire object
  const stagiaireFields = {};
  if (nom) stagiaireFields.nom = nom;
  if (prenom) stagiaireFields.prenom = prenom;
  if (email) stagiaireFields.email = email;
  if (telephone) stagiaireFields.telephone = telephone;
  if (etablissement) stagiaireFields.etablissement = etablissement;
  if (formation) stagiaireFields.formation = formation;
  if (avatar) stagiaireFields.avatar = avatar;
  if (status) stagiaireFields.status = status;
  if (dateDebut) stagiaireFields.dateDebut = dateDebut;
  if (dateFin) stagiaireFields.dateFin = dateFin;

  try {
    let stagiaire = await Stagiaire.findById(req.params.id);

    if (!stagiaire) {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }

    // Update
    stagiaire = await Stagiaire.findByIdAndUpdate(
      req.params.id,
      { $set: stagiaireFields },
      { new: true }
    );

    res.json(stagiaire);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/stagiaires/:id
// @desc    Delete a stagiaire
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const stagiaire = await Stagiaire.findById(req.params.id);

    if (!stagiaire) {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }

    await stagiaire.deleteOne();
    res.json({ message: 'Stagiaire supprimé' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
