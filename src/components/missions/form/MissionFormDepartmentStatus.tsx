
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./MissionFormSchema";

interface MissionFormDepartmentStatusProps {
  form: UseFormReturn<MissionFormValues>;
  language: string;
}

export const MissionFormDepartmentStatus: React.FC<MissionFormDepartmentStatusProps> = ({ form, language }) => {
  const getLabel = (field: string) => {
    if (field === "department") {
      return language === "fr" ? "Département" : 
             language === "en" ? "Department" : 
             "Departemanta";
    } else if (field === "status") {
      return language === "fr" ? "Statut" : 
             language === "en" ? "Status" : 
             "Sata";
    }
    return field;
  };

  const getPlaceholder = (field: string) => {
    if (field === "department") {
      return language === "fr" ? "Département concerné" : 
             language === "en" ? "Department concerned" : 
             "Departemanta voakasika";
    } else if (field === "status") {
      return language === "fr" ? "Sélectionner un statut" : 
             language === "en" ? "Select a status" : 
             "Mifidiana sata";
    }
    return "";
  };

  const getStatusOption = (status: string) => {
    if (status === "not_started") {
      return language === "fr" ? "Non commencée" : 
             language === "en" ? "Not started" : 
             "Tsy nanomboka";
    } else if (status === "in_progress") {
      return language === "fr" ? "En cours" : 
             language === "en" ? "In progress" : 
             "Eo am-panatanterahana";
    } else if (status === "completed") {
      return language === "fr" ? "Terminée" : 
             language === "en" ? "Completed" : 
             "Vita";
    }
    return status;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="departement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{getLabel("department")}</FormLabel>
            <FormControl>
              <Input placeholder={getPlaceholder("department")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{getLabel("status")}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={getPlaceholder("status")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="not_started">{getStatusOption("not_started")}</SelectItem>
                <SelectItem value="in_progress">{getStatusOption("in_progress")}</SelectItem>
                <SelectItem value="completed">{getStatusOption("completed")}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
