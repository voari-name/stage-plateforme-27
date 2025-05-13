
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./MissionFormSchema";

interface MissionFormProgressProps {
  form: UseFormReturn<MissionFormValues>;
  language: string;
}

export const MissionFormProgress: React.FC<MissionFormProgressProps> = ({ form, language }) => {
  const progressValue = form.watch("progress");
  
  const getLabel = () => {
    return language === "fr" ? "Progression" : 
           language === "en" ? "Progress" : 
           "Fandrosoana";
  };

  return (
    <FormField
      control={form.control}
      name="progress"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center mb-2">
            <FormLabel>{getLabel()}</FormLabel>
            <span className="text-sm font-medium">{field.value}%</span>
          </div>
          <FormControl>
            <Slider
              min={0}
              max={100}
              step={5}
              defaultValue={[progressValue || 0]}
              onValueChange={(values) => field.onChange(values[0])}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
