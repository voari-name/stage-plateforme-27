
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Calendar, Camera, Save, X, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";

const Profil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("/lovable-uploads/aa4b9f4c-2bff-4893-a101-3498804ab803.png");
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [profileData, setProfileData] = useState({
    fullName: "RAHAJANIAINA Olivier",
    email: "olivier.rahajaniaina@mtefop.mg",
    phone: "+261 34 12 345 67",
    hireDate: "01/01/2023"
  });
  
  const [formData, setFormData] = useState({...profileData});
  const [animateProfile, setAnimateProfile] = useState(false);
  
  useEffect(() => {
    // Animation d'entrée
    setAnimateProfile(true);
  }, []);
  
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
    setShowImageUpload(false);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setProfileImage(event.target.result);
          toast({
            title: "Photo de profil mise à jour",
            description: "Votre photo de profil a été changée avec succès."
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full">
                <Card 
                  className={`shadow-lg border-blue-200 dark:border-blue-800 overflow-hidden transition-all duration-700 transform ${animateProfile ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                >
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800"></div>
                  <div className="px-6 pb-6 -mt-16 flex flex-col items-center relative">
                    <div className="relative">
                      <Avatar className="border-4 border-white dark:border-gray-800 h-32 w-32 shadow-lg hover:scale-105 transition-transform cursor-pointer" onClick={() => setShowImageUpload(true)}>
                        <AvatarImage src={profileImage} alt="Photo de profil" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-xl">RO</AvatarFallback>
                      </Avatar>
                      
                      {showImageUpload && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={triggerFileInput}
                          >
                            <Camera className="h-5 w-5" />
                            <span className="sr-only">Changer la photo</span>
                          </Button>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                      )}
                      
                      {!showImageUpload && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900"
                          onClick={() => setShowImageUpload(true)}
                        >
                          <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="sr-only">Changer la photo</span>
                        </Button>
                      )}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold text-blue-800 dark:text-blue-300">{profileData.fullName}</h2>
                    <p className="text-muted-foreground">Administrateur</p>
                    
                    {/* Commutateur de thème */}
                    <div className="flex items-center space-x-2 mt-4">
                      <Sun className="h-5 w-5 text-amber-500" />
                      <Switch 
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                      />
                      <Moon className="h-5 w-5 text-blue-700 dark:text-blue-400" />
                      <span className="text-sm text-muted-foreground ml-2">
                        {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
                      </span>
                    </div>
                    
                    {!isEditing && !showImageUpload && (
                      <Button 
                        onClick={() => setIsEditing(true)} 
                        className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800"
                      >
                        Modifier le profil
                      </Button>
                    )}
                    
                    {showImageUpload && (
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCancel}
                          className="flex items-center"
                        >
                          <X className="mr-1 h-4 w-4" />
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
                
                <Card className={`mt-6 shadow-md border-blue-200 dark:border-blue-800 transition-all duration-700 delay-300 transform ${animateProfile ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800 dark:text-blue-300">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName" className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                            Nom complet
                          </Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center">
                            <Mail className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center">
                            <Phone className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                            Téléphone
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="hireDate" className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                            Date d'embauche
                          </Label>
                          <Input
                            id="hireDate"
                            name="hireDate"
                            value={formData.hireDate}
                            onChange={handleChange}
                            className="border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
                          />
                        </div>
                        
                        <div className="flex space-x-4 pt-4">
                          <Button 
                            onClick={handleSave}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 flex items-center"
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Enregistrer
                          </Button>
                          <Button 
                            onClick={handleCancel} 
                            variant="outline"
                            className="border-blue-200 dark:border-blue-700 flex items-center"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <User className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nom complet</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{profileData.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Mail className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{profileData.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Phone className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Téléphone</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{profileData.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                          <Calendar className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Date d'embauche</p>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{profileData.hireDate}</p>
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
