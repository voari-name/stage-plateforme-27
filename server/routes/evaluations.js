
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Evaluation = require('../models/Evaluation');
const Stagiaire = require('../models/Stagiaire');

// @route   GET api/evaluations
// @desc    Get all evaluations
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate('stagiaire', 'nom prenom avatar')
      .sort({ createdAt: -1 });
    res.json(evaluations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/evaluations/:id
// @desc    Get evaluation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('stagiaire', 'nom prenom avatar');
    
    if (!evaluation) {
      return res.status(404).json({ message: 'Évaluation non trouvée' });
    }
    
    res.json(evaluation);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Évaluation non trouvée' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

// @route   GET api/evaluations/stagiaire/:stagiaireId
// @desc    Get evaluations by stagiaire ID
// @access  Private
router.get('/stagiaire/:stagiaireId', auth, async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ stagiaire: req.params.stagiaireId })
      .sort({ date: -1 });
    res.json(evaluations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   POST api/evaluations
// @desc    Create an evaluation
// @access  Private
router.post('/', auth, async (req, res) => {
  const {
    stagiaire,
    date,
    notePonctualite,
    noteIntegration,
    noteInitiative,
    noteCompetencesTechniques,
    commentaire
  } = req.body;

  try {
    // Check if stagiaire exists
    const stagiaireExists = await Stagiaire.findById(stagiaire);
    if (!stagiaireExists) {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }

    // Calculate average score
    const noteMoyenne = (
      parseInt(notePonctualite) +
      parseInt(noteIntegration) +
      parseInt(noteInitiative) +
      parseInt(noteCompetencesTechniques)
    ) / 4;

    const newEvaluation = new Evaluation({
      stagiaire,
      date,
      notePonctualite,
      noteIntegration,
      noteInitiative,
      noteCompetencesTechniques,
      noteMoyenne: parseFloat(noteMoyenne.toFixed(2)),
      commentaire
    });

    const evaluation = await newEvaluation.save();
    
    // Populate stagiaire data before returning
    await evaluation.populate('stagiaire', 'nom prenom avatar');
    
    res.json(evaluation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// @route   PUT api/evaluations/:id
// @desc    Update an evaluation
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const {
    date,
    notePonctualite,
    noteIntegration,
    noteInitiative,
    noteCompetencesTechniques,
    commentaire
  } = req.body;

  // Build evaluation object
  const evaluationFields = {};
  if (date) evaluationFields.date = date;
  if (notePonctualite !== undefined) evaluationFields.notePonctualite = notePonctualite;
  if (noteIntegration !== undefined) evaluationFields.noteIntegration = noteIntegration;
  if (noteInitiative !== undefined) evaluationFields.noteInitiative = noteInitiative;
  if (noteCompetencesTechniques !== undefined) evaluationFields.noteCompetencesTechniques = noteCompetencesTechniques;
  if (commentaire !== undefined) evaluationFields.commentaire = commentaire;

  // Recalculate average if any score was updated
  if (
    notePonctualite !== undefined ||
    noteIntegration !== undefined ||
    noteInitiative !== undefined ||
    noteCompetencesTechniques !== undefined
  ) {
    try {
      const evaluation = await Evaluation.findById(req.params.id);
      
      if (!evaluation) {
        return res.status(404).json({ message: 'Évaluation non trouvée' });
      }
      
      const newNotePonctualite = notePonctualite !== undefined ? notePonctualite : evaluation.notePonctualite;
      const newNoteIntegration = noteIntegration !== undefined ? noteIntegration : evaluation.noteIntegration;
      const newNoteInitiative = noteInitiative !== undefined ? noteInitiative : evaluation.noteInitiative;
      const newNoteCompetencesTechniques = noteCompetencesTechniques !== undefined ? noteCompetencesTechniques : evaluation.noteCompetencesTechniques;
      
      const noteMoyenne = (
        parseInt(newNotePonctualite) +
        parseInt(newNoteIntegration) +
        parseInt(newNoteInitiative) +
        parseInt(newNoteCompetencesTechniques)
      ) / 4;
      
      evaluationFields.noteMoyenne = parseFloat(noteMoyenne.toFixed(2));
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Erreur serveur');
    }
  }

  try {
    let evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Évaluation non trouvée' });
    }

    // Update
    evaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      { $set: evaluationFields },
      { new: true }
    ).populate('stagiaire', 'nom prenom avatar');

    res.json(evaluation);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Évaluation non trouvée' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

// @route   DELETE api/evaluations/:id
// @desc    Delete an evaluation
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Évaluation non trouvée' });
    }

    await evaluation.deleteOne();
    res.json({ message: 'Évaluation supprimée' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Évaluation non trouvée' });
    }
    
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
