
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export function SecuritySection() {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const passwordMutation = useMutation({
    mutationFn: async (formData: { 
      currentPassword: string; 
      newPassword: string;
    }) => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors du changement de mot de passe');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: language === "fr" ? "Mot de passe mis à jour" : 
               language === "en" ? "Password updated" : 
               "Teny miafina nohavaozina",
        description: language === "fr" ? "Votre mot de passe a été changé avec succès" : 
                     language === "en" ? "Your password has been successfully changed" : 
                     "Nahomby ny fanovana ny teny miafinao",
        variant: "default",
      });
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    },
    onError: (error: Error) => {
      toast({
        title: language === "fr" ? "Erreur" : 
               language === "en" ? "Error" : 
               "Hadisoana",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const validateForm = () => {
    const newErrors: {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = language === "fr" ? "Le mot de passe actuel est requis" : 
                                  language === "en" ? "Current password is required" : 
                                  "Ilaina ny teny miafina ankehitriny";
    }
    
    if (!newPassword) {
      newErrors.newPassword = language === "fr" ? "Le nouveau mot de passe est requis" : 
                              language === "en" ? "New password is required" : 
                              "Ilaina ny teny miafina vaovao";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = language === "fr" ? "Le mot de passe doit contenir au moins 6 caractères" : 
                              language === "en" ? "Password must be at least 6 characters long" : 
                              "Ny teny miafina dia tokony ahitana loharano 6 farafahakeliny";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = language === "fr" ? "La confirmation du mot de passe est requise" : 
                                 language === "en" ? "Password confirmation is required" : 
                                 "Ilaina ny fanamafisana teny miafina";
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = language === "fr" ? "Les mots de passe ne correspondent pas" : 
                                 language === "en" ? "Passwords do not match" : 
                                 "Tsy mifanaraka ny teny miafina";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      passwordMutation.mutate({
        currentPassword,
        newPassword
      });
    }
  };

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
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className={errors.currentPassword ? "text-destructive" : ""}>
                {language === "fr" ? "Mot de passe actuel" : 
                 language === "en" ? "Current password" : 
                 "Teny miafina ankehitriny"}
              </Label>
              <Input 
                id="currentPassword" 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={errors.currentPassword ? "border-destructive" : ""}
              />
              {errors.currentPassword && (
                <p className="text-xs text-destructive">{errors.currentPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className={errors.newPassword ? "text-destructive" : ""}>
                {language === "fr" ? "Nouveau mot de passe" : 
                 language === "en" ? "New password" : 
                 "Teny miafina vaovao"}
              </Label>
              <Input 
                id="newPassword" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={errors.newPassword ? "border-destructive" : ""}
              />
              {errors.newPassword && (
                <p className="text-xs text-destructive">{errors.newPassword}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={errors.confirmPassword ? "text-destructive" : ""}>
                {language === "fr" ? "Confirmer le mot de passe" : 
                 language === "en" ? "Confirm password" : 
                 "Hamarino ny teny miafina"}
              </Label>
              <Input 
                id="confirmPassword" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-primary to-primary/70 hover:from-primary/80 hover:to-primary/60"
            disabled={passwordMutation.isPending}
          >
            {passwordMutation.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {language === "fr" ? "Traitement..." : 
                 language === "en" ? "Processing..." : 
                 "Eo am-piasana..."}
              </span>
            ) : (
              language === "fr" ? "Mettre à jour le mot de passe" : 
              language === "en" ? "Update password" : 
              "Havaozina ny teny miafina"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
