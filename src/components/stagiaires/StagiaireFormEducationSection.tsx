
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { StagiaireFormValues } from "./StagiaireForm";

type Props = {
  control: Control<StagiaireFormValues>;
};

const StagiaireFormEducationSection = ({ control }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <FormField
      control={control}
      name="etablissement"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Établissement</FormLabel>
          <FormControl>
            <Input placeholder="Nom de l'établissement" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="formation"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Formation</FormLabel>
          <FormControl>
            <Input placeholder="Intitulé de la formation" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default StagiaireFormEducationSection;
