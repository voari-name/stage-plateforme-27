
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrightnessControl } from '@/components/profile/BrightnessControl';
import { useToast } from '@/hooks/use-toast';
import { Sun, User } from 'lucide-react';

const Profil = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Récupérer les informations utilisateur du localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (err) {
        console.error("Erreur lors de la récupération des données utilisateur:", err);
      }
    }
  }, []);

  const handleBrightnessChange = (brightness: number) => {
    // Cette fonction est appelée lorsque la luminosité change
    // On pourrait appeler une API pour sauvegarder la préférence côté serveur
    console.log("Nouvelle luminosité:", brightness);
    
    // Simuler une sauvegarde réussie côté serveur
    setTimeout(() => {
      toast({
        title: "Préférences mises à jour",
        description: `La luminosité a été réglée à ${brightness}%`,
      });
    }, 500);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profil Utilisateur</h1>
        </div>
        
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  <CardTitle>Informations Personnelles</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</p>
                    <p className="text-lg">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                    <p className="text-lg capitalize">{user.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-orange-500" />
                  <CardTitle>Préférences d'affichage</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <BrightnessControl
                    defaultValue={user.brightness || 100}
                    onBrightnessChange={handleBrightnessChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profil;
