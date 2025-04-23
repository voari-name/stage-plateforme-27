import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { StagiaireType } from "./StagiaireCard";
import { useToast } from "@/hooks/use-toast";
import StagiaireFormIdentitySection from "./StagiaireFormIdentitySection";
import StagiaireFormContactSection from "./StagiaireFormContactSection";
import StagiaireFormEducationSection from "./StagiaireFormEducationSection";
import StagiaireFormStatusSection from "./StagiaireFormStatusSection";
import StagiaireFormDatesSection from "./StagiaireFormDatesSection";
import StagiaireFormIntituleSection from "./StagiaireFormIntituleSection";

const stagiaireFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  etablissement: z.string().min(2, "L'établissement doit être spécifié"),
  formation: z.string().min(2, "La formation doit être spécifiée"),
  status: z.enum(["active", "upcoming", "completed"]),
  dateDebut: z.date({
    required_error: "Une date de début est requise",
  }),
  dateFin: z.date({
    required_error: "Une date de fin est requise",
  }),
  intitule: z.string().min(2, "L'intitulé doit contenir au moins 2 caractères"),
}).refine(data => data.dateFin >= data.dateDebut, {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["dateFin"],
});

export type StagiaireFormValues = z.infer<typeof stagiaireFormSchema>;

type StagiaireFormProps = {
  onSubmit: (values: StagiaireFormValues) => void;
  initialValues?: Partial<StagiaireType>;
  onCancel: () => void;
  isEdit?: boolean;
};

export const StagiaireForm = ({
  onSubmit,
  initialValues,
  onCancel,
  isEdit = false,
}: StagiaireFormProps) => {
  const { toast } = useToast();
  
  const parseDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const defaultValues: Partial<StagiaireFormValues> = {
    nom: initialValues?.nom || "",
    prenom: initialValues?.prenom || "",
    email: initialValues?.email || "",
    telephone: initialValues?.telephone || "",
    etablissement: initialValues?.etablissement || "",
    formation: initialValues?.formation || "",
    status: initialValues?.status || "upcoming",
    dateDebut: initialValues?.dateDebut ? parseDate(initialValues.dateDebut) : undefined,
    dateFin: initialValues?.dateFin ? parseDate(initialValues.dateFin) : undefined,
    intitule: initialValues?.intitule || "",
  };

  const form = useForm<StagiaireFormValues>({
    resolver: zodResolver(stagiaireFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = (values: StagiaireFormValues) => {
    try {
      onSubmit(values);
      toast({
        title: isEdit ? "Stagiaire modifié" : "Stagiaire ajouté",
        description: isEdit 
          ? "Les informations du stagiaire ont été mises à jour avec succès."
          : "Le nouveau stagiaire a été ajouté avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary mb-4">
          {isEdit 
            ? "Modifier les informations du stagiaire" 
            : "Ajouter un nouveau stagiaire"}
        </h2>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <StagiaireFormIdentitySection control={form.control} />
          <StagiaireFormContactSection control={form.control} />
          <StagiaireFormEducationSection control={form.control} />
          <StagiaireFormStatusSection control={form.control} />
          <StagiaireFormDatesSection control={form.control} />
          <StagiaireFormIntituleSection control={form.control} />
          <div className="flex justify-end space-x-2 pt-3">
            <Button variant="outline" type="button" onClick={onCancel} size="sm">
              Annuler
            </Button>
            <Button 
              type="submit" 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {isEdit ? "Modifier" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};
