
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

export function LanguageSection() {
  const { language, setLanguage } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();

  const handleLanguageChange = (newLanguage: "fr" | "en" | "mg") => {
    setLanguage(newLanguage);
    
    toast({
      title: language === "fr" ? "Langue mise à jour" : 
             language === "en" ? "Language updated" : 
             "Fiteny nohavaozina",
      description: language === "fr" ? `La langue a été changée en ${newLanguage === "fr" ? "Français" : newLanguage === "en" ? "Anglais" : "Malagasy"}` : 
                   language === "en" ? `Language has been changed to ${newLanguage === "fr" ? "French" : newLanguage === "en" ? "English" : "Malagasy"}` : 
                   `Ny fiteny dia novaina ho ${newLanguage === "fr" ? "Frantsay" : newLanguage === "en" ? "Anglisy" : "Malagasy"}`,
    });
  };

  return (
    <Card className="shadow-md border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          <CardTitle>{t("settings.language")}</CardTitle>
        </div>
        <CardDescription>
          {language === "fr" ? "Choisissez la langue de l'interface" : 
           language === "en" ? "Choose interface language" : 
           "Safidio ny fiteny ampiasaina"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Button 
            variant={language === "fr" ? "default" : "outline"}
            className={language === "fr" ? "bg-gradient-to-r from-primary to-primary-foreground/20 text-primary-foreground" : ""}
            onClick={() => handleLanguageChange("fr")}
          >
            Français
          </Button>
          <Button 
            variant={language === "en" ? "default" : "outline"}
            className={language === "en" ? "bg-gradient-to-r from-primary to-primary-foreground/20 text-primary-foreground" : ""}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </Button>
          <Button 
            variant={language === "mg" ? "default" : "outline"}
            className={language === "mg" ? "bg-gradient-to-r from-primary to-primary-foreground/20 text-primary-foreground" : ""}
            onClick={() => handleLanguageChange("mg")}
          >
            Malagasy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
