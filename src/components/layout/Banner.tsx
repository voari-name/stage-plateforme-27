
import { cn } from "@/lib/utils";

type BannerProps = {
  className?: string;
};

export function Banner({ className }: BannerProps) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <img 
        src="/lovable-uploads/358b4660-85cb-412f-ad10-97bde6b157e9.png" 
        alt="Bannière MTEFoP" 
        className="w-full h-auto"
        title="Ministère du Travail, de l'Emploi et de la Fonction Publique - République de Madagascar"
      />
    </div>
  );
}
