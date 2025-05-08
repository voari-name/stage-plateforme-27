
import { createClient } from '@supabase/supabase-js';

// Configuration de base pour Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simuler un utilisateur en local (pour développement sans connexion Supabase)
export const ensureLocalUserExists = () => {
  const localUser = localStorage.getItem('localUser');
  if (!localUser) {
    const defaultUser = {
      id: 'local-user-id',
      email: 'rahajaniaina@example.com',
      username: 'RAHAJANIAINA',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem('localUser', JSON.stringify(defaultUser));
    console.log('Utilisateur local créé');
  }
  return JSON.parse(localStorage.getItem('localUser') || '{}');
};

// Fonction pour vérifier et obtenir l'utilisateur actuel
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (data?.session?.user) {
      return data.session.user;
    }
    
    if (error) {
      console.log('Aucune session active, utilisation de l\'utilisateur local');
      return ensureLocalUserExists();
    }
    
    return ensureLocalUserExists();
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return ensureLocalUserExists();
  }
};

// Fonction pour créer un utilisateur si nécessaire
export const ensureUserExists = async () => {
  try {
    // Essayer de s'authentifier avec Supabase
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
        console.error("Erreur lors de la création de l'utilisateur:", error);
      } else {
        console.log("Utilisateur créé avec succès");
      }
    }
  } catch (error) {
    console.error("Erreur lors de la vérification/création de l'utilisateur:", error);
    // Fallback: créer un utilisateur local
    ensureLocalUserExists();
  }
};

// Initialiser l'utilisateur local
ensureLocalUserExists();
// Essayer d'initialiser l'utilisateur Supabase également
ensureUserExists();
