
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./MissionFormSchema";

interface MissionFormBasicInfoProps {
  form: UseFormReturn<MissionFormValues>;
  language: string;
}

export const MissionFormBasicInfo: React.FC<MissionFormBasicInfoProps> = ({ form, language }) => {
  const getLabel = (field: string) => {
    if (field === "title") {
      return language === "fr" ? "Titre" : 
             language === "en" ? "Title" : 
             "Lohateny";
    } else if (field === "description") {
      return language === "fr" ? "Description" : 
             language === "en" ? "Description" : 
             "Fanazavana";
    }
    return field;
  };

  const getPlaceholder = (field: string) => {
    if (field === "title") {
      return language === "fr" ? "Titre de la mission" : 
             language === "en" ? "Mission title" : 
             "Lohateny ny iraka";
    } else if (field === "description") {
      return language === "fr" ? "Description détaillée de la mission" : 
             language === "en" ? "Detailed mission description" : 
             "Fanazavana feno momba ny iraka";
    }
    return "";
  };

  return (
    <>
      <FormField
        control={form.control}
        name="titre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{getLabel("title")}</FormLabel>
            <FormControl>
              <Input placeholder={getPlaceholder("title")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{getLabel("description")}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={getPlaceholder("description")} 
                className="min-h-[100px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
