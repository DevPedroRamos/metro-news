
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
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
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/noticias" element={
            <DashboardLayout>
              <Noticias />
            </DashboardLayout>
          } />
          <Route path="/treinamento" element={
            <DashboardLayout>
              <Treinamento />
            </DashboardLayout>
          } />
          <Route path="/processos" element={
            <DashboardLayout>
              <Processos />
            </DashboardLayout>
          } />
          <Route path="/links-uteis" element={
            <DashboardLayout>
              <LinksUteis />
            </DashboardLayout>
          } />
          <Route path="/campeoes" element={
            <DashboardLayout>
              <Campeoes />
            </DashboardLayout>
          } />
          <Route path="/superintendencia" element={
            <DashboardLayout>
              <Superintendencia />
            </DashboardLayout>
          } />
          <Route path="/perfil" element={
            <DashboardLayout>
              <Perfil />
            </DashboardLayout>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
