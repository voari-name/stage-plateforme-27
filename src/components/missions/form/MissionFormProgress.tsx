
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./MissionFormSchema";

interface MissionFormProgressProps {
  form: UseFormReturn<MissionFormValues>;
}

export const MissionFormProgress: React.FC<MissionFormProgressProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="progress"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Progression ({field.value}%)</FormLabel>
          <FormControl>
            <Input
              type="range"
              min="0"
              max="100"
              step="5"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
              className="w-full"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
