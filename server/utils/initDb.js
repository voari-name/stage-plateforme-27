const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initAdminUser = async () => {
  try {
    const username = 'RAHAJANIAINA';
    const rawPassword = 'Olivier';

    const adminExists = await User.findOne({ username });

    if (!adminExists) {
      console.log('Création de l\'utilisateur administrateur par défaut...');

      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const defaultAdmin = new User({
        username,
        email: 'rahajaniaina@example.com',
        password: hashedPassword,
        nom: 'RAHAJANIAINA',
        prenom: 'Administrateur',
        role: 'admin'
      });

      await defaultAdmin.save();
      console.log('Utilisateur administrateur créé avec succès');
    } else {
      console.log('L\'utilisateur administrateur existe déjà');
    }
  } catch (err) {
    console.error('Erreur lors de l\'initialisation de l\'administrateur :', err.message);
  }
};

module.exports = { initAdminUser };