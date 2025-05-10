
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import Stagiaires from "./pages/Stagiaires";
import Evaluations from "./pages/Evaluations";
import APropos from "./pages/APropos";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Profil from "./pages/Profil";
import GestionProjets from "./pages/GestionProjets";
import Missions from "./pages/Missions";
import Parametres from "./pages/Parametres";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
                isAuthenticated ? 
                <ProtectedRoute>
                  <Navigate to="/a-propos" />
                </ProtectedRoute> : 
                <Navigate to="/login" />
              } />
              
              <Route path="/login" element={<Login />} />
              
              <Route path="/stagiaires" element={
                <ProtectedRoute>
                  <Stagiaires />
                </ProtectedRoute>
              } />
              <Route path="/evaluations" element={
                <ProtectedRoute>
                  <Evaluations />
                </ProtectedRoute>
              } />
              <Route path="/a-propos" element={
                <ProtectedRoute>
                  <APropos />
                </ProtectedRoute>
              } />
              <Route path="/profil" element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
              } />
              <Route path="/parametres" element={
                <ProtectedRoute>
                  <Parametres />
                </ProtectedRoute>
              } />
              <Route path="/gestion-projets" element={
                <ProtectedRoute>
                  <GestionProjets />
                </ProtectedRoute>
              } />
              <Route path="/missions" element={
                <ProtectedRoute>
                  <Missions />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
