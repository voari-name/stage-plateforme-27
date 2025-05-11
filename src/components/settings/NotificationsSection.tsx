
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BellRing } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/lib/translations";

export function NotificationsSection() {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [notifications, setNotifications] = useState(true);

  return (
    <Card className="shadow-md border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-primary" />
          <CardTitle>{t("settings.notifications")}</CardTitle>
        </div>
        <CardDescription>
          {language === "fr" ? "Gérez la façon dont vous recevez les notifications" : 
           language === "en" ? "Manage how you receive notifications" : 
           "Alamino ny fampahafantarana anao"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="flex items-center gap-2">
            {language === "fr" ? "Notifications par email" : 
             language === "en" ? "Email notifications" : 
             "Fampahafantarana amin'ny mailaka"}
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
              {language === "fr" ? "Recommandé" : 
               language === "en" ? "Recommended" : 
               "Ampirino"}
            </span>
          </Label>
          <Switch 
            id="notifications" 
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push">
            {language === "fr" ? "Notifications push" : 
             language === "en" ? "Push notifications" : 
             "Fampahafantarana mivantana"}
          </Label>
          <Switch id="push" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="weekly">
            {language === "fr" ? "Résumé hebdomadaire" : 
             language === "en" ? "Weekly summary" : 
             "Famintinana isan-kerinandro"}
          </Label>
          <Switch id="weekly" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}
