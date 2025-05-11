
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Palette, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/lib/translations";
import { BrightnessControl } from "@/components/ui/brightness-control";

export function AppearanceSection() {
  const { theme, toggleTheme, language } = useTheme();
  const { t } = useTranslation(language);
  const [darkMode, setDarkMode] = useState(theme === "dark");
  
  // Update theme toggle when darkMode state changes
  useEffect(() => {
    if ((darkMode && theme === "light") || (!darkMode && theme === "dark")) {
      toggleTheme();
    }
  }, [darkMode]);
  
  // Update local state when theme changes from external sources
  useEffect(() => {
    setDarkMode(theme === "dark");
  }, [theme]);

  return (
    <Card className="shadow-md border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <CardTitle>{t("settings.appearance")}</CardTitle>
        </div>
        <CardDescription>
          {language === "fr" ? "Personnalisez l'apparence de l'application" : 
           language === "en" ? "Customize application appearance" : 
           "Amboary ny endrika"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="darkMode" className="flex items-center gap-2">
            {darkMode ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {t("settings.darkMode")}
          </Label>
          <Switch 
            id="darkMode" 
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
        
        <BrightnessControl />
        
        <div className="space-y-2">
          <Label>
            {language === "fr" ? "Couleur principale" : 
             language === "en" ? "Primary color" : 
             "Loko voalohany"}
          </Label>
          <div className="flex gap-2 flex-wrap">
            {["#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#f97316"].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded-full border-2 border-background shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ backgroundColor: color }}
                aria-label={`Sélectionner la couleur ${color}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
