
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/lib/translations";
import { 
  Shield, 
  BellRing, 
  Palette, 
  Languages, 
  Database, 
  Lock, 
  X, 
  Download, 
  RefreshCcw,
  Sun,
  Moon
} from "lucide-react";

const Parametres = () => {
  const { toast } = useToast();
  const { theme, toggleTheme, language, setLanguage, brightness, setBrightness } = useTheme();
  const { t } = useTranslation(language);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(theme === "dark");
  
  // Update theme toggle when darkMode state changes
  useEffect(() => {
    if ((darkMode && theme === "light") || (!darkMode && theme === "dark")) {
      toggleTheme();
    }
  }, [darkMode]);
  
  // Update local state when theme changes from external sources
  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);
  
  const handleResetApp = () => {
    // Confirmation avant de réinitialiser
    if (window.confirm(language === "fr" ? 
        "Êtes-vous sûr de vouloir réinitialiser toutes les données? Cette action est irréversible." : 
        language === "en" ? 
        "Are you sure you want to reset all data? This action is irreversible." :
        "Azo antoka fa tianao averina ny angona rehetra? Tsy azo avadika intsony ity.")) {
      // Supprime tous les stagiaires du localStorage
      localStorage.removeItem("mtefop-stagiaires");
      
      toast({
        title: language === "fr" ? "Application réinitialisée" : 
               language === "en" ? "Application reset" : "Naverina ny fampiharana",
        description: language === "fr" ? "Toutes les données ont été supprimées avec succès." :
                     language === "en" ? "All data have been successfully deleted." : 
                     "Voafafa soa aman-tsara ny angona rehetra.",
      });
    }
  };
  
  // Handle brightness change
  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0]);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-background/50 to-background">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 text-foreground">
              {language === "fr" ? "Paramètres" : language === "en" ? "Settings" : "Safidy"}
            </h1>
            
            <div className="grid gap-6">
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
                      onClick={() => setLanguage("fr")}
                    >
                      Français
                    </Button>
                    <Button 
                      variant={language === "en" ? "default" : "outline"}
                      className={language === "en" ? "bg-gradient-to-r from-primary to-primary-foreground/20 text-primary-foreground" : ""}
                      onClick={() => setLanguage("en")}
                    >
                      English
                    </Button>
                    <Button 
                      variant={language === "mg" ? "default" : "outline"}
                      className={language === "mg" ? "bg-gradient-to-r from-primary to-primary-foreground/20 text-primary-foreground" : ""}
                      onClick={() => setLanguage("mg")}
                    >
                      Malagasy
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <CardTitle>{t("settings.appearance")}</CardTitle>
                  </div>
                  <CardDescription>
                    {language === "fr" ? "Personnalisez l'apparence de l'application" : 
                     language === "en" ? "Customize application appearance" : 
                     "Amboary ny endrika"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode" className="flex items-center gap-2">
                      {darkMode ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                      {t("settings.darkMode")}
                    </Label>
                    <Switch 
                      id="darkMode" 
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      {language === "fr" ? "Luminosité" : 
                       language === "en" ? "Brightness" : 
                       "Hazavana"}
                       : {brightness}%
                    </Label>
                    <Slider 
                      defaultValue={[brightness]} 
                      min={50} 
                      max={150} 
                      step={5}
                      onValueChange={handleBrightnessChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      {language === "fr" ? "Couleur principale" : 
                       language === "en" ? "Primary color" : 
                       "Loko voalohany"}
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {["#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#f97316"].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-background shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                          style={{ backgroundColor: color }}
                          aria-label={`Sélectionner la couleur ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-primary" />
                    <CardTitle>{t("settings.notifications")}</CardTitle>
                  </div>
                  <CardDescription>
                    {language === "fr" ? "Gérez la façon dont vous recevez les notifications" : 
                     language === "en" ? "Manage how you receive notifications" : 
                     "Alamino ny fampahafantarana anao"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="flex items-center gap-2">
                      {language === "fr" ? "Notifications par email" : 
                       language === "en" ? "Email notifications" : 
                       "Fampahafantarana amin'ny mailaka"}
                      <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                        {language === "fr" ? "Recommandé" : 
                         language === "en" ? "Recommended" : 
                         "Ampirino"}
                      </span>
                    </Label>
                    <Switch 
                      id="notifications" 
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push">
                      {language === "fr" ? "Notifications push" : 
                       language === "en" ? "Push notifications" : 
                       "Fampahafantarana mivantana"}
                    </Label>
                    <Switch id="push" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly">
                      {language === "fr" ? "Résumé hebdomadaire" : 
                       language === "en" ? "Weekly summary" : 
                       "Famintinana isan-kerinandro"}
                    </Label>
                    <Switch id="weekly" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle>{t("settings.data")}</CardTitle>
                  </div>
                  <CardDescription>
                    {language === "fr" ? "Gérez vos données et exportations" : 
                     language === "en" ? "Manage your data and exports" : 
                     "Lamino ny angona sy ny fanondranana"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    {language === "fr" ? "Exporter les données" : 
                     language === "en" ? "Export data" : 
                     "Hamoaka angona"}
                  </Button>
                  <Separator />
                  <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                    <p>
                      {language === "fr" ? "Cliquez pour réinitialiser l'application et supprimer toutes les données." : 
                       language === "en" ? "Click to reset the application and delete all data." : 
                       "Tsindrio raha hamerina ny fampiharana sy hamafa ny angona rehetra."}
                    </p>
                    <Button 
                      variant="destructive" 
                      className="mt-2 flex items-center gap-2"
                      onClick={handleResetApp}
                    >
                      <RefreshCcw className="h-4 w-4" />
                      {t("settings.reset")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Parametres;
