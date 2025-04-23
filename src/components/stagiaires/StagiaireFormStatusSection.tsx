
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { StagiaireFormValues } from "./StagiaireForm";

type Props = {
  control: Control<StagiaireFormValues>;
};

const StagiaireFormStatusSection = ({ control }: Props) => (
  <FormField
    control={control}
    name="status"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Statut</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="upcoming">À venir</SelectItem>
            <SelectItem value="active">En cours</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default StagiaireFormStatusSection;
