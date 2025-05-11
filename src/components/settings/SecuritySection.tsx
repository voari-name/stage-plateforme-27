
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/lib/translations";

export function SecuritySection() {
  const { language } = useTheme();
  const { t } = useTranslation(language);

  return (
    <Card className="shadow-md border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>{t("settings.security")}</CardTitle>
        </div>
        <CardDescription>
          {language === "fr" ? "Configurez les paramètres de sécurité" : 
           language === "en" ? "Configure security settings" : 
           "Alamino ny filaminana"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              {language === "fr" ? "Mot de passe actuel" : 
               language === "en" ? "Current password" : 
               "Teny miafina ankehitriny"}
            </Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              {language === "fr" ? "Nouveau mot de passe" : 
               language === "en" ? "New password" : 
               "Teny miafina vaovao"}
            </Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {language === "fr" ? "Confirmer le mot de passe" : 
               language === "en" ? "Confirm password" : 
               "Hamarino ny teny miafina"}
            </Label>
            <Input id="confirmPassword" type="password" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-gradient-to-r from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60">
          {language === "fr" ? "Mettre à jour le mot de passe" : 
           language === "en" ? "Update password" : 
           "Havaozina ny teny miafina"}
        </Button>
      </CardFooter>
    </Card>
  );
}
