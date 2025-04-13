
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    fullName: "RAHAJANIAINA Olivier",
    email: "olivier.rahajaniaina@mtefop.mg",
    phone: "+261 34 12 345 67",
    hireDate: "01/01/2023"
  });
  
  const [formData, setFormData] = useState({...profileData});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    setProfileData({...formData});
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été mises à jour avec succès.",
    });
  };
  
  const handleCancel = () => {
    setFormData({...profileData});
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full">
                <Card className="shadow-lg border-blue-200 overflow-hidden">
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="px-6 pb-6 -mt-12 flex flex-col items-center">
                    <Avatar className="border-4 border-white h-24 w-24 shadow-lg">
                      <AvatarImage src="/lovable-uploads/aa4b9f4c-2bff-4893-a101-3498804ab803.png" alt="RAHAJANIAINA Olivier" />
                      <AvatarFallback>RO</AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-2xl font-bold">{profileData.fullName}</h2>
                    <p className="text-muted-foreground">Administrateur</p>
                    
                    {!isEditing && (
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      >
                        Modifier le profil
                      </Button>
                    )}
                  </div>
                </Card>
                
                <Card className="mt-6 shadow-md border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-500" />
                            Nom complet
                          </Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center">
                            <Mail className="h-5 w-5 mr-2 text-blue-500" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-blue-500" />
                            Téléphone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="hireDate" className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                            Date d'embauche
                          </Label>
                          <Input
                            id="hireDate"
                            name="hireDate"
                            value={formData.hireDate}
                            onChange={handleChange}
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </div>
                        
                        <div className="flex space-x-4 pt-4">
                          <Button 
                            onClick={handleSave}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                          >
                            Enregistrer
                          </Button>
                          <Button 
                            onClick={handleCancel} 
                            variant="outline"
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-3 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nom complet</p>
                            <p className="font-medium">{profileData.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-3 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{profileData.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-3 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <p className="font-medium">{profileData.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-3 text-blue-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Date d'embauche</p>
                            <p className="font-medium">{profileData.hireDate}</p>
                          </div>
                        </div>
                      </div>
                    )}
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
