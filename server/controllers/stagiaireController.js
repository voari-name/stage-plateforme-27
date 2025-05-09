
const Stagiaire = require('../models/Stagiaire');
const jwt = require('jsonwebtoken');

// Utility function to validate token if present
const validateTokenIfPresent = (req) => {
  const token = req.header('x-auth-token');
  // Verify token if provided, but continue even without valid token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecrettoken');
      req.user = decoded.user;
      return true;
    } catch (err) {
      console.log('Token invalide, mais on continue quand même');
      return false;
    }
  }
  return false;
};

// Get all stagiaires
const getAllStagiaires = async (req, res) => {
  try {
    validateTokenIfPresent(req);
    
    const stagiaires = await Stagiaire.find().sort({ createdAt: -1 });
    res.json(stagiaires);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Get stagiaire by ID
const getStagiaireById = async (req, res) => {
  try {
    validateTokenIfPresent(req);
    
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
};

// Create a new stagiaire
const createStagiaire = async (req, res) => {
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
    dateFin,
    intitule
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
      dateFin,
      intitule
    });

    const stagiaire = await newStagiaire.save();
    res.json(stagiaire);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Update a stagiaire
const updateStagiaire = async (req, res) => {
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
    dateFin,
    intitule
  } = req.body;

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
  if (intitule) stagiaireFields.intitule = intitule;

  try {
    let stagiaire = await Stagiaire.findById(req.params.id);

    if (!stagiaire) {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }

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
};

// Delete a stagiaire
const deleteStagiaire = async (req, res) => {
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
};

module.exports = {
  getAllStagiaires,
  getStagiaireById,
  createStagiaire,
  updateStagiaire,
  deleteStagiaire
};
