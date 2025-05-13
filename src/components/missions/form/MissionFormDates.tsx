
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { MissionFormValues } from "./MissionFormSchema";

interface MissionFormDatesProps {
  form: UseFormReturn<MissionFormValues>;
  language: string;
}

export const MissionFormDates: React.FC<MissionFormDatesProps> = ({ form, language }) => {
  const getLocale = () => {
    switch(language) {
      case "fr": return fr;
      case "en": return enUS;
      // Note: Madagascar doesn't have an official locale in date-fns
      // Using fr as fallback for mg
      case "mg": return fr;
      default: return fr;
    }
  };

  const getLabel = (field: string) => {
    if (field === "start_date") {
      return language === "fr" ? "Date de début" : 
             language === "en" ? "Start date" : 
             "Daty fanombohana";
    } else if (field === "end_date") {
      return language === "fr" ? "Date de fin" : 
             language === "en" ? "End date" : 
             "Daty fifaranana";
    }
    return field;
  };

  const getPlaceholder = () => {
    return language === "fr" ? "Choisir une date" : 
           language === "en" ? "Choose a date" : 
           "Mifidiana daty";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="dateDebut"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{getLabel("start_date")}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy", { locale: getLocale() })
                    ) : (
                      <span>{getPlaceholder()}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                  locale={getLocale()}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dateFin"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{getLabel("end_date")}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy", { locale: getLocale() })
                    ) : (
                      <span>{getPlaceholder()}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                  locale={getLocale()}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
