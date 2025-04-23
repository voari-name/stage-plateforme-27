
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Initialise la base de données avec un utilisateur administrateur par défaut
 */
const initAdminUser = async () => {
  try {
    // Vérifier si l'utilisateur administrateur existe déjà
    const adminExists = await User.findOne({ username: 'RAHAJANIAINA' });
    
    if (!adminExists) {
      console.log('Création de l\'utilisateur administrateur par défaut...');
      
      // Créer l'administrateur par défaut
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('olivier', salt);
      
      const defaultAdmin = new User({
        username: 'RAHAJANIAINA',
        email: 'rahajaniaina@example.com',
        password: hashedPassword,
        nom: 'RAHAJANIAINA',
        prenom: 'Olivier',
        role: 'admin'
      });
      
      await defaultAdmin.save();
      console.log('Utilisateur administrateur créé avec succès');
    } else {
      console.log('L\'utilisateur administrateur existe déjà');
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de l\'administrateur:', err);
  }
};

module.exports = { initAdminUser };
