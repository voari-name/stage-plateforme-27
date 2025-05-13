
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { LanguageSection } from "@/components/settings/LanguageSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { DataSection } from "@/components/settings/DataSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { useTheme } from "@/components/ThemeProvider";

const Parametres = () => {
  const { language } = useTheme();
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-background/50 to-background">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-bold mb-6 text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {language === "fr" ? "Paramètres" : language === "en" ? "Settings" : "Safidy"}
            </h1>
            
            <div className="grid gap-6">
              <LanguageSection />
              <AppearanceSection />
              <DataSection />
              <SecuritySection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Parametres;
