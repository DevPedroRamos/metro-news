import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Noticias from "./pages/Noticias";
import NoticiaDetalhes from "./pages/NoticiaDetalhes";
import Treinamento from "./pages/Treinamento";
import Processos from "./pages/Processos";
import LinksUteis from "./pages/LinksUteis";
import Metas from "./pages/Metas";
import Campeoes from "./pages/Campeoes";
import Superintendencia from "./pages/Superintendencia";
import Perfil from "./pages/Perfil";
import Pagamentos from "./pages/Pagamentos";
import Vendas from "./pages/pagamentos/vendas";
import Premiacao from "./pages/pagamentos/premiacao";
import SaldoCef from "./pages/pagamentos/saldo-cef";
import Distratos from "./pages/pagamentos/distratos"; 
import Outros from "./pages/pagamentos/outros";
import MinhaEquipe from "./pages/MinhaEquipe";
import ComprovantesEquipe from "./pages/ComprovantesEquipe";
import Agendamentos from "./pages/Agendamentos";
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
                <Index />
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
          <Route path="/noticias/:slug" element={
            <ProtectedRoute>
              <DashboardLayout>
                <NoticiaDetalhes />
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
          <Route path="/metas" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Metas />
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
          <Route path="/minha-equipe" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MinhaEquipe />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/comprovantes-equipe" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ComprovantesEquipe />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/agendamentos" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Agendamentos />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/pagamentos">
            <Route index element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Pagamentos />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="vendas" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Vendas />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="premiacao" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Premiacao />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="saldo-cef" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SaldoCef />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="distratos" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Distratos />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="outros" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outros />
                </DashboardLayout>
              </ProtectedRoute>
            } />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
