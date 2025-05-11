
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ThemeProvider";

interface BrightnessControlProps {
  label?: string;
}

export function BrightnessControl({ label }: BrightnessControlProps) {
  const { brightness, setBrightness, language } = useTheme();
  const [value, setValue] = useState(brightness);
  
  useEffect(() => {
    setValue(brightness);
  }, [brightness]);
  
  const handleChange = (newValue: number[]) => {
    setValue(newValue[0]);
    setBrightness(newValue[0]);
  };
  
  const getLabel = () => {
    if (label) return label;
    
    return language === "fr" 
      ? "Luminosité" 
      : language === "en" 
        ? "Brightness" 
        : "Hazavana";
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{getLabel()}</Label>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Slider
        value={[value]}
        min={50}
        max={150}
        step={5}
        onValueChange={handleChange}
      />
    </div>
  );
}
