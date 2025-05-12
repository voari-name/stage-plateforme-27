
export const getLanguageLabel = (section: string, language: string): string => {
  const labels: Record<string, Record<string, string>> = {
    "main": {
      "fr": "Principal",
      "en": "Main",
      "mg": "Fototra"
    },
    "projects": {
      "fr": "Projets",
      "en": "Projects",
      "mg": "Tetikasa"
    },
    "account": {
      "fr": "Compte",
      "en": "Account",
      "mg": "Kaonty"
    }
  };

  return labels[section]?.[language] || section;
};
