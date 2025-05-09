
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BrightnessIcon, KeyIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrightnessControl } from "@/components/profile/BrightnessControl";

const profileSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
  newPassword: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(1, "La confirmation du mot de passe est requise"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const API_URL = "http://localhost:5000/api";

const Profil = () => {
  const { toast } = useToast();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [brightness, setBrightness] = useState(100);
  const [offline, setOffline] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Load user data
    const fetchUserData = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const localUser = JSON.parse(userString);
          
          // Try to fetch from API first
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/auth/me`, {
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token || ''
              }
            });
            
            if (!response.ok) {
              throw new Error('Erreur de chargement des données utilisateur');
            }
            
            const userData = await response.json();
            setUserData(userData);
            setOffline(false);
            
            // Update form
            profileForm.reset({
              prenom: userData.prenom || '',
              nom: userData.nom || '',
              email: userData.email || '',
            });
            
            // Set brightness from preferences
            if (userData.preferences?.brightness) {
              setBrightness(userData.preferences.brightness);
              document.documentElement.style.filter = `brightness(${userData.preferences.brightness}%)`;
            }
            
          } catch (error) {
            console.error("Erreur API, utilisation des données locales:", error);
            // Fallback to local data
            setUserData(localUser);
            setOffline(true);
            
            // Update form with local data
            profileForm.reset({
              prenom: localUser.prenom || '',
              nom: localUser.nom || '',
              email: localUser.email || '',
            });
            
            // Set brightness from local storage if available
            if (localUser.brightness) {
              setBrightness(localUser.brightness);
              document.documentElement.style.filter = `brightness(${localUser.brightness}%)`;
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger vos informations"
        });
      }
    };
    
    fetchUserData();
  }, []);
  
  const onSubmitProfile = async (data: ProfileFormValues) => {
    setIsLoadingProfile(true);
    
    try {
      if (offline) {
        // Update local storage in offline mode
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          const updatedUser = {
            ...user,
            nom: data.nom,
            prenom: data.prenom,
            email: data.email
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUserData(updatedUser);
        }
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées localement (mode hors-ligne)"
        });
      } else {
        // Update via API
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/update-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour du profil');
        }
        
        const updatedUserData = await response.json();
        setUserData(updatedUserData);
        
        // Update local storage
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          localStorage.setItem('user', JSON.stringify({
            ...user,
            nom: data.nom,
            prenom: data.prenom,
            email: data.email
          }));
        }
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil"
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };
  
  const onSubmitPassword = async (data: PasswordFormValues) => {
    setIsLoadingPassword(true);
    
    try {
      if (offline) {
        toast({
          variant: "destructive",
          title: "Mode hors-ligne",
          description: "Le changement de mot de passe n'est pas disponible en mode hors-ligne"
        });
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur lors du changement de mot de passe');
      }
      
      toast({
        title: "Mot de passe changé",
        description: "Votre mot de passe a été modifié avec succès"
      });
      
      // Reset form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
    } catch (error: any) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de changer votre mot de passe"
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };
  
  const handleBrightnessChange = async (value: number) => {
    setBrightness(value);
    
    try {
      if (!offline) {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/auth/preferences`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          },
          body: JSON.stringify({
            brightness: value
          })
        });
      }
      
      // Always update local storage for offline use
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        localStorage.setItem('user', JSON.stringify({
          ...user,
          brightness: value
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la luminosité:", error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
          <div className="max-w-3xl mx-auto space-y-6">
            {offline && (
              <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md shadow">
                <p className="font-medium">Mode hors-ligne actif</p>
                <p className="text-sm">Les modifications seront sauvegardées localement</p>
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Mon profil</h1>
            </div>

            <Tabs defaultValue="infos" className="w-full">
              <TabsList className="mb-6 bg-white/50 backdrop-blur-sm dark:bg-slate-800/50">
                <TabsTrigger value="infos" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations personnelles
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <KeyIcon className="h-4 w-4" />
                  Sécurité
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <BrightnessIcon className="h-4 w-4" />
                  Préferences
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="infos">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>
                      Modifiez vos informations personnelles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="prenom"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="nom"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                            disabled={isLoadingProfile}
                          >
                            {isLoadingProfile ? "Enregistrement..." : "Enregistrer les modifications"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Changer de mot de passe</CardTitle>
                    <CardDescription>
                      Mettez à jour votre mot de passe pour sécuriser votre compte
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mot de passe actuel</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nouveau mot de passe</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmer mot de passe</FormLabel>
                                <FormControl>
                                  <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="pt-4">
                          <Button 
                            type="submit" 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                            disabled={isLoadingPassword || offline}
                          >
                            {isLoadingPassword ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences d'affichage</CardTitle>
                    <CardDescription>
                      Personnalisez l'apparence de l'interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="px-2">
                        <BrightnessControl 
                          defaultValue={brightness} 
                          onBrightnessChange={handleBrightnessChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profil;
