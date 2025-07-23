
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Noticias from "./pages/Noticias";
import Treinamento from "./pages/Treinamento";
import Processos from "./pages/Processos";
import LinksUteis from "./pages/LinksUteis";
import Campeoes from "./pages/Campeoes";
import Superintendencia from "./pages/Superintendencia";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/noticias" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Noticias />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/treinamento" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Treinamento />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/processos" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Processos />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/links-uteis" element={
            <ProtectedRoute>
              <DashboardLayout>
                <LinksUteis />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/campeoes" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Campeoes />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/superintendencia" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Superintendencia />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Perfil />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
