
import { cn } from "@/lib/utils";

type BannerProps = {
  className?: string;
};

export function Banner({ className }: BannerProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-lg shadow-lg hover-card", className)}>
      <img 
        src="/lovable-uploads/f848bffa-320a-4c13-8168-9a97dbe56fe3.png" 
        alt="Bannière MTEFoP" 
        className="w-full h-auto object-cover border border-amber-100"
        title="Ministère du Travail, de l'Emploi et de la Fonction Publique - République de Madagascar"
      />
    </div>
  );
}
