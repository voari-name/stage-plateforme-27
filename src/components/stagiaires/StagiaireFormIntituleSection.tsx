
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { StagiaireFormValues } from "./StagiaireForm";

type Props = {
  control: Control<StagiaireFormValues>;
};

const StagiaireFormIntituleSection = ({ control }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <FormField
      control={control}
      name="intitule"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Intitulé</FormLabel>
          <FormControl>
            <Input placeholder="Intitulé du stage ou de la mission" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default StagiaireFormIntituleSection;
