
import { useState, useEffect } from "react";
import { Banner } from "@/components/layout/Banner";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Globe, FileText, Users } from "lucide-react";

const APropos = () => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    // Déclencher l'animation après le chargement de la page
    setAnimate(true);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Header />
        <main className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-[calc(100vh-4rem)]">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">À propos</h1>
          
          <div className="mb-8 overflow-hidden rounded-xl shadow-lg">
            <Banner className="transition-all duration-700 transform hover:scale-[1.02]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={`border-blue-200 shadow-md overflow-hidden transition-all duration-700 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/5c0ae490-98de-4bfa-bff1-df9fe97ebe0b.png" 
                      alt="MTEFoP Logo" 
                      className="h-12 w-12"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-blue-800">Ministère du Travail, de l'Emploi et de la Fonction Publique</h2>
                    <p className="text-sm text-gray-600">République de Madagascar</p>
                  </div>
                </div>
                
                <p className="leading-relaxed text-gray-700">
                  Le Ministère du Travail, de l'Emploi et de la Fonction Publique (MTEFoP) est chargé 
                  de concevoir, de mettre en œuvre, de coordonner et d'évaluer la politique du Gouvernement 
                  en matière de travail, d'emploi et de fonction publique.
                </p>
                
                <p className="leading-relaxed text-gray-700">
                  Cette plateforme permet de gérer les stagiaires et leurs missions au sein du ministère, 
                  facilitant ainsi le suivi et l'évaluation des stages.
                </p>
                
                <div className="pt-4 flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Plus de 500 stagiaires accompagnés</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Plateforme de gestion intégrée des stages</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`border-blue-200 shadow-md overflow-hidden transition-all duration-700 delay-300 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-blue-800 flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 hover:bg-blue-50 rounded-lg transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <a href="mailto:contact@mtefop.mg" className="text-blue-600 hover:underline">contact@mtefop.mg</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 hover:bg-blue-50 rounded-lg transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Téléphone</p>
                      <p>+261 20 22 651 31</p>
                      <p>+261 34 05 717 07</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 hover:bg-blue-50 rounded-lg transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Adresse</p>
                      <p>Rue Agosthino Neto, Anosy</p>
                      <p>Antananarivo 101, Madagascar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 hover:bg-blue-50 rounded-lg transition-colors">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Site Web</p>
                      <a href="https://mtefop.gov.mg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        www.mtefop.gov.mg
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default APropos;
