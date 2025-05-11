
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Database, Download, RefreshCcw } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

export function DataSection() {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();

  const handleResetApp = () => {
    // Confirmation avant de réinitialiser
    if (window.confirm(language === "fr" ? 
        "Êtes-vous sûr de vouloir réinitialiser toutes les données? Cette action est irréversible." : 
        language === "en" ? 
        "Are you sure you want to reset all data? This action is irreversible." :
        "Azo antoka fa tianao averina ny angona rehetra? Tsy azo avadika intsony ity.")) {
      // Supprime tous les stagiaires du localStorage
      localStorage.removeItem("mtefop-stagiaires");
      
      toast({
        title: language === "fr" ? "Application réinitialisée" : 
               language === "en" ? "Application reset" : "Naverina ny fampiharana",
        description: language === "fr" ? "Toutes les données ont été supprimées avec succès." :
                     language === "en" ? "All data have been successfully deleted." : 
                     "Voafafa soa aman-tsara ny angona rehetra.",
      });
    }
  };

  return (
    <Card className="shadow-md border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle>{t("settings.data")}</CardTitle>
        </div>
        <CardDescription>
          {language === "fr" ? "Gérez vos données et exportations" : 
           language === "en" ? "Manage your data and exports" : 
           "Lamino ny angona sy ny fanondranana"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <Download className="h-4 w-4" />
          {language === "fr" ? "Exporter les données" : 
           language === "en" ? "Export data" : 
           "Hamoaka angona"}
        </Button>
        <Separator />
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <p>
            {language === "fr" ? "Cliquez pour réinitialiser l'application et supprimer toutes les données." : 
             language === "en" ? "Click to reset the application and delete all data." : 
             "Tsindrio raha hamerina ny fampiharana sy hamafa ny angona rehetra."}
          </p>
          <Button 
            variant="destructive" 
            className="mt-2 flex items-center gap-2"
            onClick={handleResetApp}
          >
            <RefreshCcw className="h-4 w-4" />
            {t("settings.reset")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
