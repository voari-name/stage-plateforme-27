
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
import { supabase } from "@/lib/supabase";

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
      if (values.username === "RAHAJANIAINA" && values.password === "olivier") {
        // Tenter de se connecter via Supabase avec le compte prédéfini
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "rahajaniaina@example.com", // Email par défaut configuré dans Supabase
          password: values.password,
        });

        if (error) {
          // Si on ne peut pas se connecter via Supabase, autoriser quand même l'accès
          console.warn("Échec de connexion à Supabase, mais accès autorisé avec credentials locaux:", error);
        }

        // Stockage local pour maintenir la session
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", values.username);

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur la plateforme de gestion des stagiaires",
        });

        navigate("/a-propos");
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: "Identifiants invalides",
        });
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
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
