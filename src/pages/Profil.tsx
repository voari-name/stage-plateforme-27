
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Mail, Phone, Edit, Lock, Calendar, Award } from "lucide-react";

const Profil = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-1/3">
                <Card className="shadow-lg border-blue-200 overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="px-6 pb-6 -mt-12 flex flex-col items-center">
                    <Avatar className="border-4 border-white h-24 w-24 shadow-lg">
                      <AvatarImage src="/lovable-uploads/aa4b9f4c-2bff-4893-a101-3498804ab803.png" alt="RAHAJANIAINA Olivier" />
                      <AvatarFallback>RO</AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-2xl font-bold">RAHAJANIAINA Olivier</h2>
                    <p className="text-muted-foreground">Administrateur</p>
                    <Button variant="outline" className="mt-4 w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier le profil
                    </Button>
                  </div>
                </Card>
                
                <Card className="mt-6 shadow-md border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-3 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nom complet</p>
                        <p className="font-medium">RAHAJANIAINA Olivier</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">olivier.rahajaniaina@mtefop.mg</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">+261 34 12 345 67</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date d'embauche</p>
                        <p className="font-medium">01/01/2023</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex-1">
                <Card className="shadow-lg border-blue-200">
                  <CardHeader>
                    <CardTitle>Tableau de bord personnel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="activite">
                      <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="activite">Activité récente</TabsTrigger>
                        <TabsTrigger value="stagiaires">Stagiaires</TabsTrigger>
                        <TabsTrigger value="securite">Sécurité</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="activite" className="space-y-4">
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Award className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium">Stagiaire ajouté</p>
                                <p className="text-sm text-muted-foreground">
                                  Vous avez ajouté un nouveau stagiaire
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">Il y a {i} jour{i > 1 ? "s" : ""}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="stagiaires">
                        <div className="text-center py-10 text-muted-foreground">
                          <p>Les informations sur les stagiaires seront basées sur ce que vous ajoutez via le formulaire.</p>
                          <Button className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                            Voir tous les stagiaires
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="securite">
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Lock className="h-5 w-5 mr-3 text-blue-500" />
                                <div>
                                  <p className="font-medium">Changer de mot de passe</p>
                                  <p className="text-sm text-muted-foreground">Modifiez votre mot de passe</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Modifier</Button>
                            </div>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Mail className="h-5 w-5 mr-3 text-blue-500" />
                                <div>
                                  <p className="font-medium">Changer d'email</p>
                                  <p className="text-sm text-muted-foreground">Modifiez votre adresse email</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Modifier</Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profil;
