
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stagiaireController = require('../controllers/stagiaireController');

// @route   GET api/stagiaires
// @desc    Get all stagiaires
// @access  Private (but works without auth)
router.get('/', stagiaireController.getAllStagiaires);

// @route   GET api/stagiaires/:id
// @desc    Get stagiaire by ID
// @access  Private (but works without auth)
router.get('/:id', stagiaireController.getStagiaireById);

// @route   POST api/stagiaires
// @desc    Create a stagiaire
// @access  Private
router.post('/', auth, stagiaireController.createStagiaire);

// @route   PUT api/stagiaires/:id
// @desc    Update a stagiaire
// @access  Private
router.put('/:id', auth, stagiaireController.updateStagiaire);

// @route   DELETE api/stagiaires/:id
// @desc    Delete a stagiaire
// @access  Private
router.delete('/:id', auth, stagiaireController.deleteStagiaire);

module.exports = router;
