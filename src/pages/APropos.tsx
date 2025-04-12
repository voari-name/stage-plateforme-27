
import { Banner } from "@/components/layout/Banner";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const APropos = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">À propos</h1>
          
          <div className="mb-8">
            <Banner />
          </div>
          
          <div className="prose max-w-none">
            <h2>Ministère du Travail, de l'Emploi et de la Fonction Publique</h2>
            <p>
              Le Ministère du Travail, de l'Emploi et de la Fonction Publique (MTEFoP) est chargé 
              de concevoir, de mettre en œuvre, de coordonner et d'évaluer la politique du Gouvernement 
              en matière de travail, d'emploi et de fonction publique.
            </p>
            <p>
              Cette plateforme permet de gérer les stagiaires et leurs missions au sein du ministère, 
              facilitant ainsi le suivi et l'évaluation des stages.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default APropos;
