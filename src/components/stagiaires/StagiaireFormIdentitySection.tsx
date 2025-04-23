
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { StagiaireFormValues } from "./StagiaireForm";

type Props = {
  control: Control<StagiaireFormValues>;
};

const StagiaireFormIdentitySection = ({ control }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <FormField
      control={control}
      name="nom"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom</FormLabel>
          <FormControl>
            <Input placeholder="Nom" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="prenom"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Prénom</FormLabel>
          <FormControl>
            <Input placeholder="Prénom" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default StagiaireFormIdentitySection;
