
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour créer un utilisateur si nécessaire
export const ensureUserExists = async () => {
  try {
    // Vérifier si l'utilisateur RAHAJANIAINA existe déjà
    const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
      email: 'rahajaniaina@example.com',
      password: 'olivier'
    });
    
    // Si l'utilisateur existe déjà, pas besoin de le créer
    if (existingUser?.user) {
      console.log("Utilisateur existant trouvé");
      return;
    }
    
    // Si l'utilisateur n'existe pas, le créer
    if (checkError) {
      console.log("Création d'un nouvel utilisateur");
      const { data, error } = await supabase.auth.signUp({
        email: 'rahajaniaina@example.com',
        password: 'olivier',
        options: {
          data: {
            username: 'RAHAJANIAINA'
          }
        }
      });
      
      if (error) {
        console.error('Erreur lors de la création de l'utilisateur:', error);
      } else {
        console.log('Utilisateur créé avec succès');
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification/création de l'utilisateur:', error);
  }
};

// Create the projects table if it doesn't exist
const createTables = async () => {
  try {
    const { data: exists } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (!exists) {
      const { error } = await supabase.rpc('create_initial_tables');
      if (error) console.error('Error creating tables:', error);
    }
  } catch (error) {
    console.error('Erreur lors de la vérification/création des tables:', error);
  }
};

// Initialiser les tables et l'utilisateur
ensureUserExists().then(() => createTables());
