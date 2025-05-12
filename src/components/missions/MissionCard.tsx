
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMissionStatusConfig } from "./utils";

export type Stagiaire = {
  id: string;
  nom: string;
  prenom: string;
  avatar?: string;
};

export type MissionType = {
  id: string;
  titre: string;
  description: string;
  status: "not_started" | "in_progress" | "completed";
  dateDebut: string;
  dateFin: string;
  progress: number;
  departement: string;
  stagiaires: Stagiaire[];
};

type MissionCardProps = {
  mission: MissionType;
  onViewDetails?: (id: string) => void;
  onAssign?: (id: string) => void;
};

export const MissionCard = ({ mission, onViewDetails, onAssign }: MissionCardProps) => {
  const statusConfig = getMissionStatusConfig(mission.status);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{mission.titre}</h3>
            <p className="text-sm text-muted-foreground">
              {mission.description}
            </p>
          </div>
          <Badge className={cn("font-normal flex items-center", statusConfig.className)}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {mission.dateDebut} - {mission.dateFin}
            </span>
          </div>
          <span className="text-muted-foreground">
            {mission.departement}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression</span>
            <span>{mission.progress}%</span>
          </div>
          <Progress value={mission.progress} className="h-2" />
        </div>
        
        <div className="pt-2">
          <p className="text-sm font-medium mb-2 flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            Stagiaires assignés
          </p>
          <div className="flex -space-x-2">
            {mission.stagiaires.map((stagiaire) => (
              <Avatar key={stagiaire.id} className="border-2 border-background h-8 w-8">
                <AvatarImage src={stagiaire.avatar} alt={`${stagiaire.prenom} ${stagiaire.nom}`} />
                <AvatarFallback className="text-xs">
                  {stagiaire.prenom[0]}{stagiaire.nom[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {mission.stagiaires.length === 0 && (
              <span className="text-sm text-muted-foreground">Aucun stagiaire assigné</span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-end mt-auto">
        {onAssign && (
          <Button variant="outline" className="mr-2" onClick={() => onAssign(mission.id)}>
            Assigner
          </Button>
        )}
        {onViewDetails && (
          <Button onClick={() => onViewDetails(mission.id)}>
            Voir détails
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
