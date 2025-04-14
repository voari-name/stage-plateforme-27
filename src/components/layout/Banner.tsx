
import { cn } from "@/lib/utils";

type BannerProps = {
  className?: string;
};

export function Banner({ className }: BannerProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-lg shadow-md", className)}>
      <img 
        src="/lovable-uploads/b35315d7-2a89-4367-b349-6279c94aec1d.png" 
        alt="Bannière MTEFoP" 
        className="w-full h-auto object-cover"
        title="Ministère du Travail, de l'Emploi et de la Fonction Publique - République de Madagascar"
      />
    </div>
  );
}
