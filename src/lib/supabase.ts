
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create the projects table if it doesn't exist
const createTables = async () => {
  const { data: exists } = await supabase
    .from('projects')
    .select('id')
    .limit(1);

  if (!exists) {
    const { error } = await supabase.rpc('create_initial_tables');
    if (error) console.error('Error creating tables:', error);
  }
};

// Initialize tables
createTables();

