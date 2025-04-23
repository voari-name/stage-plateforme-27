
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { StagiaireFormValues } from "./StagiaireForm";

type Props = {
  control: Control<StagiaireFormValues>;
};

const StagiaireFormContactSection = ({ control }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="email@exemple.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={control}
      name="telephone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Téléphone</FormLabel>
          <FormControl>
            <Input placeholder="06 12 34 56 78" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);

export default StagiaireFormContactSection;
