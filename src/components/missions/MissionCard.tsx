
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, Trash2 } from "lucide-react";
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
  onDelete?: (id: string) => void;
  language?: string;
};

export const MissionCard = ({ 
  mission, 
  onViewDetails, 
  onAssign,
  onDelete,
  language = "fr"
}: MissionCardProps) => {
  const statusConfig = getMissionStatusConfig(mission.status, language);
  
  const getAssignButtonText = () => {
    return language === "fr" ? "Assigner" : 
           language === "en" ? "Assign" : 
           "Hanokana";
  };

  const getDetailsButtonText = () => {
    return language === "fr" ? "Voir détails" : 
           language === "en" ? "View details" : 
           "Hijery ny antsipiriany";
  };

  const getStagiaireText = () => {
    return language === "fr" ? "Stagiaires assignés" : 
           language === "en" ? "Assigned trainees" : 
           "Mpianatra voatokana";
  };

  const getNoStagiaireText = () => {
    return language === "fr" ? "Aucun stagiaire assigné" : 
           language === "en" ? "No trainees assigned" : 
           "Tsy misy mpianatra voatokana";
  };
  
  return (
    <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] rounded-xl overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-foreground/90">{mission.titre}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {mission.description}
            </p>
          </div>
          <Badge className={cn("font-normal flex items-center shadow-sm", statusConfig.className)}>
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow pt-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary/70" />
            <span className="text-foreground/80">
              {mission.dateDebut} - {mission.dateFin}
            </span>
          </div>
          <span className="text-muted-foreground px-2 py-0.5 bg-primary/5 rounded-full text-xs">
            {mission.departement}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-foreground/80">
              {language === "fr" ? "Progression" : 
               language === "en" ? "Progress" : 
               "Fandrosoana"}
            </span>
            <span className="text-primary font-semibold">{mission.progress}%</span>
          </div>
          <Progress 
            value={mission.progress} 
            className="h-2 bg-primary/10" 
            indicatorClassName="bg-gradient-to-r from-primary/80 to-primary" 
          />
        </div>
        
        <div className="pt-2">
          <p className="text-sm font-medium mb-2 flex items-center text-foreground/80">
            <User className="h-4 w-4 mr-2 text-primary/70" />
            {getStagiaireText()}
          </p>
          <div className="flex -space-x-2">
            {mission.stagiaires.map((stagiaire) => (
              <Avatar key={stagiaire.id} className="border-2 border-background h-8 w-8 shadow-sm hover:scale-110 transition-transform">
                <AvatarImage src={stagiaire.avatar} alt={`${stagiaire.prenom} ${stagiaire.nom}`} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                  {stagiaire.prenom[0]}{stagiaire.nom[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {mission.stagiaires.length === 0 && (
              <span className="text-sm text-muted-foreground italic">{getNoStagiaireText()}</span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-primary/10 pt-4 flex justify-between mt-auto bg-primary/[0.02]">
        {onDelete && (
          <Button 
            variant="outline" 
            size="sm"
            className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30"
            onClick={() => onDelete(mission.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
          </Button>
        )}

        <div className="flex gap-2 ml-auto">
          {onAssign && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
              onClick={() => onAssign(mission.id)}
            >
              {getAssignButtonText()}
            </Button>
          )}
          {onViewDetails && (
            <Button 
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg"
              onClick={() => onViewDetails(mission.id)}
            >
              {getDetailsButtonText()}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
