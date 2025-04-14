
import { useState, useEffect } from "react";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string}[]>([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Récupérer le nom d'utilisateur stocké
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Récupérer les notifications depuis le localStorage
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

    // Écouter les événements personnalisés pour les notifications
    const handleNotification = (e: CustomEvent) => {
      const newNotification = e.detail;
      setNotifications(prev => {
        const updated = [...prev, newNotification];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('app:notification' as any, handleNotification as EventListener);
    
    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('app:notification' as any, handleNotification as EventListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    
    // Ajouter une notification de déconnexion
    const logoutNotification = {
      id: Date.now().toString(),
      title: "Déconnexion réussie",
      message: "Vous avez été déconnecté avec succès"
    };
    
    toast({
      title: logoutNotification.title,
      description: logoutNotification.message,
    });
    
    navigate("/login");
  };

  const handleClearNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("notifications", "[]");
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="h-9 md:w-[300px] lg:w-[400px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearAllNotifications}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Tout effacer
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications.length === 0 ? (
                <div className="py-4 px-2 text-center text-sm text-muted-foreground">
                  Pas de notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <DropdownMenuItem key={notification.id} className="flex items-start p-0">
                    <div className="flex flex-col w-full">
                      <div className="p-2">
                        <span className="font-medium block">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {notification.message}
                        </span>
                      </div>
                      <div className="flex justify-end bg-muted/30 p-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleClearNotification(notification.id)}
                          className="text-xs h-6"
                        >
                          Effacer
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex items-center gap-2">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col">
                <span>Mon compte</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {username || "Utilisateur"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profil')}>Profil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
