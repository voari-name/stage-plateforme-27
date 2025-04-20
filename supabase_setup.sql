
-- Créer la table projects avec les colonnes appropriées
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer Row Level Security (RLS) pour la table projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir uniquement leurs propres projets
CREATE POLICY "Users can view own projects" 
ON projects FOR SELECT 
USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de créer des projets
CREATE POLICY "Users can insert own projects" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de mettre à jour leurs propres projets
CREATE POLICY "Users can update own projects" 
ON projects FOR UPDATE 
USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs de supprimer leurs propres projets
CREATE POLICY "Users can delete own projects" 
ON projects FOR DELETE 
USING (auth.uid() = user_id);

-- Ajouter un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
