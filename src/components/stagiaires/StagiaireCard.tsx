
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Phone, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export type StagiaireStatus = "active" | "completed" | "upcoming";

export type StagiaireType = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  etablissement: string;
  formation: string;
  avatar?: string;
  status: StagiaireStatus;
  dateDebut: string;
  dateFin: string;
};

type StagiaireCardProps = {
  stagiaire: StagiaireType;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function StagiaireCard({ stagiaire, onView, onDelete }: StagiaireCardProps) {
  const statusConfig = {
    active: { label: "En cours", className: "bg-success text-success-foreground" },
    completed: { label: "Terminé", className: "bg-muted text-muted-foreground" },
    upcoming: { label: "À venir", className: "bg-warning text-warning-foreground" },
  };

  const status = statusConfig[stagiaire.status];
  
  const initials = `${stagiaire.prenom[0]}${stagiaire.nom[0]}`.toUpperCase();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src={stagiaire.avatar} alt={`${stagiaire.prenom} ${stagiaire.nom}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{`${stagiaire.prenom} ${stagiaire.nom}`}</h3>
              <p className="text-sm text-muted-foreground">{stagiaire.formation}</p>
            </div>
          </div>
          <Badge className={cn("font-normal", status.className)}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <div className="text-sm">
          <p className="font-medium">Établissement</p>
          <p className="text-muted-foreground">{stagiaire.etablissement}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Période</p>
          <p className="text-muted-foreground">
            {stagiaire.dateDebut} - {stagiaire.dateFin}
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2">
          <Button variant="ghost" size="sm" className="justify-start gap-2 h-8">
            <Mail className="h-4 w-4" />
            {stagiaire.email}
          </Button>
          <Button variant="ghost" size="sm" className="justify-start gap-2 h-8">
            <Phone className="h-4 w-4" />
            {stagiaire.telephone}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 px-6 py-3 flex justify-between">
        <Button
          variant="destructive"
          size="sm"
          className="gap-1"
          onClick={() => onDelete && onDelete(stagiaire.id)}
        >
          <Trash className="h-4 w-4" />
          Supprimer
        </Button>
        <Button
          variant="default"
          size="sm"
          className="gap-1"
          onClick={() => onView && onView(stagiaire.id)}
        >
          <FileText className="h-4 w-4" />
          Détails
        </Button>
      </CardFooter>
    </Card>
  );
}
