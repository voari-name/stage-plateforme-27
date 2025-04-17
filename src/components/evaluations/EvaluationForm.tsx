
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FilePenLine } from "lucide-react";

type EvaluationFormProps = {
  onSubmit: (data: {
    nom: string;
    prenom: string;
    note: number;
    genre: "masculin" | "feminin";
  }) => void;
  onCancel: () => void;
};

const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  note: z.coerce
    .number()
    .min(0, { message: "La note ne peut pas être négative." })
    .max(20, { message: "La note ne peut pas dépasser 20." }),
  genre: z.enum(["masculin", "feminin"], {
    required_error: "Veuillez sélectionner le genre.",
  }),
});

export function EvaluationForm({ onSubmit, onCancel }: EvaluationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      note: 0,
      genre: "masculin",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({
      nom: values.nom,
      prenom: values.prenom,
      note: values.note,
      genre: values.genre
    });
    
    // Reset form after submission
    form.reset({
      nom: "",
      prenom: "",
      note: 0,
      genre: "masculin",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nom"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Nom</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nom du stagiaire" 
                  {...field}
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="prenom"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Prénom</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Prénom du stagiaire" 
                  {...field} 
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-gray-200">Note du stage</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    min="0" 
                    max="20" 
                    {...field} 
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">sur 20</div>
                </div>
              </FormControl>
              <FormDescription className="dark:text-gray-400">
                Attribuez une note entre 0 et 20.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="dark:text-gray-200">Genre</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="masculin" />
                    </FormControl>
                    <FormLabel className="font-normal dark:text-gray-300">
                      Masculin
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="feminin" />
                    </FormControl>
                    <FormLabel className="font-normal dark:text-gray-300">
                      Féminin
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
          >
            <FilePenLine className="h-4 w-4 mr-2" /> Créer l'évaluation
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Annuler
          </Button>
        </div>
      </form>
    </Form>
  );
}
