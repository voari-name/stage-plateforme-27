
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const db = req.db;

  try {
    // Check if user exists by username
    const [existingUsersByUsername] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (existingUsersByUsername.length > 0) {
      return res.status(400).json({ message: 'Cet identifiant existe déjà' });
    }
    
    // Check if user exists by email
    if (email) {
      const [existingUsersByEmail] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUsersByEmail.length > 0) {
        return res.status(400).json({ message: 'Cet email existe déjà' });
      }
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user into database
    const [result] = await db.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );
    
    // Get the newly inserted user
    const [users] = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    const user = users[0];

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    // Create and return JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const db = req.db;

  try {
    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Update last login time
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    // Create and return JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const db = req.db;
    const [users] = await db.query(
      'SELECT id, username, email, role, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(users[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  const { theme, brightness } = req.body;
  const db = req.db;
  
  try {
    // Vérifions d'abord si la table des préférences existe
    const [tables] = await db.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'user_preferences'
    `, [process.env.DB_NAME || 'stage_platform']);
    
    // Si elle n'existe pas, créons-la
    if (tables.length === 0) {
      await db.query(`
        CREATE TABLE user_preferences (
          user_id INT(11) NOT NULL,
          theme VARCHAR(50) DEFAULT 'light',
          brightness INT DEFAULT 100,
          PRIMARY KEY (user_id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
    }
    
    // Vérifions si l'utilisateur a déjà des préférences
    const [preferences] = await db.query(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [req.user.id]
    );
    
    if (preferences.length === 0) {
      // Insérer de nouvelles préférences
      await db.query(
        'INSERT INTO user_preferences (user_id, theme, brightness) VALUES (?, ?, ?)',
        [req.user.id, theme || 'light', brightness || 100]
      );
    } else {
      // Mettre à jour les préférences existantes
      await db.query(
        'UPDATE user_preferences SET theme = ?, brightness = ? WHERE user_id = ?',
        [theme || preferences[0].theme, brightness || preferences[0].brightness, req.user.id]
      );
    }
    
    // Récupérer l'utilisateur avec ses préférences
    const [users] = await db.query(
      `SELECT u.id, u.username, u.email, u.role, u.created_at, u.last_login, 
              p.theme, p.brightness
       FROM users u
       LEFT JOIN user_preferences p ON u.id = p.user_id
       WHERE u.id = ?`,
      [req.user.id]
    );
    
    const user = users[0];
    
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      preferences: {
        theme: user.theme || 'light',
        brightness: user.brightness || 100
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updatePreferences
};
