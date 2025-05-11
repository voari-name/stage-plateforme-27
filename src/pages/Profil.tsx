
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrightnessControl } from '@/components/profile/BrightnessControl';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sun, User, Mail, Phone, MapPin } from 'lucide-react';

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
    } else {
      // Si aucun utilisateur trouvé, créer un utilisateur par défaut
      const defaultUser = {
        username: "RAHAJANIAINA Olivier",
        role: "administrateur",
        email: "olivierrahajaniaina9@gmail.com",
        tel: "038 51 621 07",
        brightness: 100
      };
      localStorage.setItem('user', JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
  }, []);

  const handleBrightnessChange = (brightness: number) => {
    // Cette fonction est appelée lorsque la luminosité change
    // On pourrait appeler une API pour sauvegarder la préférence côté serveur
    console.log("Nouvelle luminosité:", brightness);
    
    // Mettre à jour les données utilisateur dans le localStorage
    if (user) {
      const updatedUser = { ...user, brightness };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    
    // Afficher un toast de confirmation
    toast({
      title: "Préférences mises à jour",
      description: `La luminosité a été réglée à ${brightness}%`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profil Utilisateur</h1>
        </div>
        
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-32 w-32 shadow-lg border-4 border-white">
                      <AvatarImage src="/lovable-uploads/5e6c13a6-fdab-4248-a467-68e7d30fd2dc.png" alt={user.username} />
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
                        {user.username.split(' ').map((name: string) => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2 text-center md:text-left flex-1">
                    <h2 className="text-2xl font-bold">{user.username}</h2>
                    <p className="text-lg text-blue-800 dark:text-blue-300 capitalize">{user.role}</p>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span>{user.email || "olivierrahajaniaina9@gmail.com"}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span>{user.tel || "038 51 621 07"}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span>Madagascar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300">
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
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{user.email || "olivierrahajaniaina9@gmail.com"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                    <p className="text-lg">{user.tel || "038 51 621 07"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow duration-300">
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
