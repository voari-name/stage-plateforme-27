
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { missionSchema, MissionFormValues } from "./form/MissionFormSchema";
import { MissionFormBasicInfo } from "./form/MissionFormBasicInfo";
import { MissionFormDepartmentStatus } from "./form/MissionFormDepartmentStatus";
import { MissionFormDates } from "./form/MissionFormDates";
import { MissionFormProgress } from "./form/MissionFormProgress";
import { MissionFormActions } from "./form/MissionFormActions";

interface MissionFormProps {
  onSubmit: (values: MissionFormValues) => void;
  onCancel: () => void;
  initialValues?: Partial<MissionFormValues>;
  isEdit?: boolean;
  language: string;
}

export const MissionForm = ({
  onSubmit,
  onCancel,
  initialValues,
  isEdit = false,
  language
}: MissionFormProps) => {
  // Current date for default values
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  // Default form values
  const defaultValues: Partial<MissionFormValues> = {
    titre: "",
    description: "",
    departement: "",
    status: "not_started",
    dateDebut: today,
    dateFin: nextMonth,
    progress: 0,
    ...initialValues
  };

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = (values: MissionFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Basic Information */}
        <MissionFormBasicInfo form={form} language={language} />

        {/* Department and Status */}
        <MissionFormDepartmentStatus form={form} language={language} />

        {/* Dates */}
        <MissionFormDates form={form} language={language} />

        {/* Progress */}
        {isEdit && <MissionFormProgress form={form} language={language} />}

        {/* Form Actions */}
        <MissionFormActions onCancel={onCancel} language={language} />
      </form>
    </Form>
  );
};

export { type MissionFormValues };
