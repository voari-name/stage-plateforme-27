
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Banner } from "@/components/layout/Banner";

const API_URL = "https://stage-plateforme.onrender.com/api";

const loginFormSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Appel à l'API pour l'authentification
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Stockage du token et des informations utilisateur
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        username: data.user.username,
        role: data.user.role
      }));
      localStorage.setItem("isLoggedIn", "true");

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur la plateforme de gestion des stagiaires",
      });

      navigate("/a-propos");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      // Si l'API n'est pas disponible, on vérifie les identifiants en local
      if (error.message.includes("Failed to fetch") && 
          values.username === "RAHAJANIAINA" && 
          values.password === "olivier") {
          
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", values.username);
        
        toast({
          title: "Connexion réussie (mode hors ligne)",
          description: "Bienvenue sur la plateforme de gestion des stagiaires",
        });
        
        navigate("/a-propos");
        return;
      }
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Identifiants invalides",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full">
        <Banner />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-blue-200">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/lovable-uploads/5c0ae490-98de-4bfa-bff1-df9fe97ebe0b.png"
                alt="MTEFoP Logo"
                className="h-16 w-16 filter drop-shadow-md"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
            <CardDescription className="text-center text-blue-100">
              Entrez vos identifiants pour accéder à la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Nom d'utilisateur</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez votre nom d'utilisateur"
                          {...field}
                          className="text-base py-6 border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Mot de passe</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder=""
                          {...field}
                          className="text-base py-6 border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full py-6 text-base bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
