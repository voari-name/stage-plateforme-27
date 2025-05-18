
import { cn } from "@/lib/utils";

type BannerProps = {
  className?: string;
};

export function Banner({ className }: BannerProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-lg shadow-lg hover-card", className)}>
      <div className="relative">
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Drapeau de Madagascar */}
              <div className="h-10 w-16 flex-shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 w-1/3 h-full bg-white" />
                <div className="absolute left-1/3 inset-y-0 w-1/3 h-full bg-red-600" />
                <div className="absolute right-0 inset-y-0 w-1/3 h-full bg-green-600" />
              </div>
              
              {/* Logo et texte */}
              <div>
                <h2 className="text-xl font-bold text-blue-800">MTEFoP</h2>
                <p className="text-sm text-gray-600">République de Madagascar</p>
              </div>
            </div>
            
            <div className="text-right">
              <h3 className="text-lg font-medium text-blue-700">
                Ministère du Travail, de l'Emploi et de la Fonction Publique
              </h3>
              <p className="text-sm text-gray-500">Fianarana - Tanimirazana - Fandrosoana</p>
            </div>
          </div>
          
          {/* Bannière tricolore en bas */}
          <div className="h-2 w-full mt-4 flex">
            <div className="h-full w-1/3 bg-white" />
            <div className="h-full w-1/3 bg-red-600" />
            <div className="h-full w-1/3 bg-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
