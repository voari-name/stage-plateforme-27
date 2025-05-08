
import { cn } from "@/lib/utils";

type BannerProps = {
  className?: string;
};

export function Banner({ className }: BannerProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-lg shadow-lg hover-card", className)}>
      <div className="relative">
        <img 
          src="/lovable-uploads/ee0ac1ab-8851-43cf-b6a7-2c5b07e35b0a.png" 
          alt="Bannière MTEFoP" 
          className="w-full h-auto object-contain border border-amber-100"
          title="Ministère du Travail, de l'Emploi et de la Fonction Publique - République de Madagascar"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
