
type TranslationKey = string;

type Translations = {
  [key: TranslationKey]: {
    fr: string;
    en: string;
    mg: string;
  };
};

export const translations: Translations = {
  "sidebar.home": {
    fr: "Accueil",
    en: "Home",
    mg: "Fandraisana",
  },
  "sidebar.stagiaires": {
    fr: "Stagiaires",
    en: "Trainees",
    mg: "Mpianatra",
  },
  "sidebar.evaluations": {
    fr: "Évaluations",
    en: "Evaluations",
    mg: "Fanombanana",
  },
  "sidebar.about": {
    fr: "À Propos",
    en: "About",
    mg: "Mombamomba",
  },
  "sidebar.projects": {
    fr: "Gestion Projets",
    en: "Project Management",
    mg: "Fitantanana Tetikasa",
  },
  "sidebar.missions": {
    fr: "Missions",
    en: "Missions",
    mg: "Iraka",
  },
  "sidebar.settings": {
    fr: "Paramètres",
    en: "Settings",
    mg: "Safidy",
  },
  "header.logout": {
    fr: "Déconnexion",
    en: "Logout",
    mg: "Hiala",
  },
  "settings.language": {
    fr: "Langue",
    en: "Language",
    mg: "Fiteny",
  },
  "settings.appearance": {
    fr: "Apparence",
    en: "Appearance",
    mg: "Endrika",
  },
  "settings.darkMode": {
    fr: "Mode sombre",
    en: "Dark mode",
    mg: "Endrika maizina",
  },
  "settings.notifications": {
    fr: "Notifications",
    en: "Notifications",
    mg: "Fampilazana",
  },
  "settings.security": {
    fr: "Sécurité",
    en: "Security",
    mg: "Filaminana",
  },
  "settings.data": {
    fr: "Données",
    en: "Data",
    mg: "Angona",
  },
  "settings.reset": {
    fr: "Réinitialiser l'application",
    en: "Reset application",
    mg: "Avereno ny fampiharana",
  },
};

export const useTranslation = (language: string) => {
  const t = (key: TranslationKey): string => {
    if (!translations[key]) {
      return key;
    }
    
    return translations[key][language as keyof typeof translations[typeof key]] || key;
  };
  
  return { t };
};
