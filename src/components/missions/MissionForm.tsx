
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

import { missionSchema, MissionFormValues } from "./form/MissionFormSchema";
import { MissionFormBasicInfo } from "./form/MissionFormBasicInfo";
import { MissionFormDepartmentStatus } from "./form/MissionFormDepartmentStatus";
import { MissionFormDates } from "./form/MissionFormDates";
import { MissionFormProgress } from "./form/MissionFormProgress";
import { MissionFormActions } from "./form/MissionFormActions";

export type { MissionFormValues } from "./form/MissionFormSchema";

type MissionFormProps = {
  onSubmit: (values: MissionFormValues) => void;
  initialValues?: Partial<MissionFormValues>;
  onCancel?: () => void;
  isEdit?: boolean;
};

export const MissionForm = ({
  onSubmit,
  initialValues,
  onCancel,
  isEdit = false,
}: MissionFormProps) => {
  const { toast } = useToast();
  
  const defaultValues: Partial<MissionFormValues> = {
    titre: initialValues?.titre || "",
    description: initialValues?.description || "",
    status: initialValues?.status || "not_started",
    dateDebut: initialValues?.dateDebut,
    dateFin: initialValues?.dateFin,
    departement: initialValues?.departement || "",
    progress: initialValues?.progress || 0,
  };

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = (values: MissionFormValues) => {
    try {
      onSubmit(values);
      toast({
        title: isEdit ? "Mission modifiée" : "Mission créée",
        description: isEdit 
          ? "Les informations de la mission ont été mises à jour avec succès."
          : "La nouvelle mission a été créée avec succès.",
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <MissionFormBasicInfo form={form} />
        <MissionFormDepartmentStatus form={form} />
        <MissionFormDates form={form} />
        <MissionFormProgress form={form} />
        <MissionFormActions onCancel={onCancel} isEdit={isEdit} />
      </form>
    </Form>
  );
};
