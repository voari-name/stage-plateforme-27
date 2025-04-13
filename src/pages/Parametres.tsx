
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Shield, 
  BellRing, 
  Palette, 
  Languages, 
  Database, 
  Lock, 
  X, 
  Download, 
  RefreshCcw 
} from "lucide-react";

const Parametres = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  
  const handleResetApp = () => {
    // Confirmation avant de réinitialiser
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données? Cette action est irréversible.")) {
      // Supprime tous les stagiaires du localStorage
      localStorage.removeItem("mtefop-stagiaires");
      
      toast({
        title: "Application réinitialisée",
        description: "Toutes les données ont été supprimées avec succès.",
      });
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-800">Paramètres</h1>
            
            <div className="grid gap-6">
              <Card className="shadow-md border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-blue-500" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>Gérez la façon dont vous recevez les notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications" className="flex items-center gap-2">
                      Notifications par email
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Recommandé</span>
                    </Label>
                    <Switch 
                      id="notifications" 
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push">
                      Notifications push
                    </Label>
                    <Switch id="push" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly">
                      Résumé hebdomadaire
                    </Label>
                    <Switch id="weekly" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-blue-500" />
                    <CardTitle>Apparence</CardTitle>
                  </div>
                  <CardDescription>Personnalisez l'apparence de l'application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">
                      Mode sombre
                    </Label>
                    <Switch 
                      id="darkMode" 
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Couleur principale</Label>
                    <div className="flex gap-2">
                      {["#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#f97316"].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          style={{ backgroundColor: color }}
                          aria-label={`Sélectionner la couleur ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-blue-500" />
                    <CardTitle>Langue</CardTitle>
                  </div>
                  <CardDescription>Choisissez la langue de l'interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant={language === "fr" ? "default" : "outline"}
                      className={language === "fr" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : ""}
                      onClick={() => setLanguage("fr")}
                    >
                      Français
                    </Button>
                    <Button 
                      variant={language === "en" ? "default" : "outline"}
                      className={language === "en" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : ""}
                      onClick={() => setLanguage("en")}
                    >
                      English
                    </Button>
                    <Button 
                      variant={language === "mg" ? "default" : "outline"}
                      className={language === "mg" ? "bg-gradient-to-r from-blue-500 to-indigo-600" : ""}
                      onClick={() => setLanguage("mg")}
                    >
                      Malagasy
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <CardTitle>Données</CardTitle>
                  </div>
                  <CardDescription>Gérez vos données et exportations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Exporter les données
                  </Button>
                  <Separator />
                  <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                    <p>Cliquez pour réinitialiser l'application et supprimer toutes les données.</p>
                    <Button 
                      variant="destructive" 
                      className="mt-2 flex items-center gap-2"
                      onClick={handleResetApp}
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Réinitialiser l'application
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <CardTitle>Sécurité</CardTitle>
                  </div>
                  <CardDescription>Configurez les paramètres de sécurité</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    Mettre à jour le mot de passe
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
