
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  GraduationCap,
  Timer,
  Users,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const stagiairesByDepartement = [
  { name: "Informatique", value: 35 },
  { name: "Marketing", value: 25 },
  { name: "Finance", value: 20 },
  { name: "RH", value: 15 },
  { name: "Logistique", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

const progressionMensuelle = [
  { name: "Jan", stagiaires: 5 },
  { name: "Fév", stagiaires: 12 },
  { name: "Mar", stagiaires: 18 },
  { name: "Avr", stagiaires: 23 },
  { name: "Mai", stagiaires: 29 },
  { name: "Juin", stagiaires: 35 },
];

// Définir correctement le type pour l'activité
type ActivityItemType = "new_stagiaire" | "mission_completed" | "evaluation_submitted" | "mission_assigned";

type ActivityItem = {
  id: string;
  type: ActivityItemType;
  title: string;
  description: string;
  timestamp: string;
};

const activitesRecentes: ActivityItem[] = [
  {
    id: "1",
    type: "new_stagiaire",
    title: "Nouveau stagiaire",
    description: "Antoine Dubois a rejoint la plateforme",
    timestamp: "Il y a 2 heures",
  },
  {
    id: "2",
    type: "mission_completed",
    title: "Mission terminée",
    description: "Julie Martin a terminé la mission 'Refonte site web'",
    timestamp: "Il y a 3 heures",
  },
  {
    id: "3",
    type: "evaluation_submitted",
    title: "Évaluation soumise",
    description: "Thomas Bernard a soumis son rapport de stage",
    timestamp: "Il y a 5 heures",
  },
  {
    id: "4",
    type: "mission_assigned",
    title: "Mission assignée",
    description: "Elise Petit a été assignée à la mission 'Étude de marché'",
    timestamp: "Il y a 1 jour",
  },
];

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard
                title="Stagiaires actifs"
                value="42"
                description="Durant ce mois"
                icon={Users}
                iconColor="primary"
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Missions en cours"
                value="18"
                description="7 à compléter cette semaine"
                icon={Timer}
                iconColor="warning"
              />
              <StatCard
                title="Évaluations complétées"
                value="85%"
                description="15 en attente"
                icon={GraduationCap}
                iconColor="success"
                trend={{ value: 5, isPositive: true }}
              />
              <StatCard
                title="Événements à venir"
                value="3"
                description="Cette semaine"
                icon={Calendar}
                iconColor="info"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Progression des stagiaires</CardTitle>
                  <CardDescription>
                    Nombre de stagiaires par mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={progressionMensuelle}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="stagiaires"
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par département</CardTitle>
                  <CardDescription>
                    Distribution des stagiaires
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stagiairesByDepartement}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {stagiairesByDepartement.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ActivityFeed activities={activitesRecentes} />
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Prochaines échéances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Évaluation mi-parcours</h3>
                          <p className="text-sm text-muted-foreground">
                            Pour 12 stagiaires
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-muted">
                          15 avril
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            Rendu final projet marketing
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Équipe communication
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-muted">
                          25 avril
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            Présentation de fin de stage
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Groupe développement
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-muted">
                          2 mai
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
