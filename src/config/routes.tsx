import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Noticias from '@/pages/Noticias';
import NoticiaDetalhes from '@/pages/NoticiaDetalhes';
import Treinamento from '@/pages/Treinamento';
import Processos from '@/pages/Processos';
import LinksUteis from '@/pages/LinksUteis';
import Metas from '@/pages/Metas';
import Campeoes from '@/pages/Campeoes';
import Superintendencia from '@/pages/Superintendencia';
import Perfil from '@/pages/Perfil';
import Pagamentos from '@/pages/Pagamentos';
import Vendas from '@/pages/pagamentos/vendas';
import Premiacao from '@/pages/pagamentos/premiacao';
import SaldoCef from '@/pages/pagamentos/saldo-cef';
import Distratos from '@/pages/pagamentos/distratos';
import Outros from '@/pages/pagamentos/outros';
import MinhaEquipe from '@/pages/MinhaEquipe';
import ComprovantesEquipe from '@/pages/ComprovantesEquipe';
import Agendamentos from '@/pages/Agendamentos';
import NotFound from '@/pages/NotFound';

const withDashboardLayout = (Component: React.ComponentType) => (
  <ProtectedRoute>
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  </ProtectedRoute>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/dashboard',
    element: withDashboardLayout(Index),
  },
  {
    path: '/noticias',
    element: withDashboardLayout(Noticias),
  },
  {
    path: '/noticias/:slug',
    element: withDashboardLayout(NoticiaDetalhes),
  },
  {
    path: '/treinamento',
    element: withDashboardLayout(Treinamento),
  },
  {
    path: '/processos',
    element: withDashboardLayout(Processos),
  },
  {
    path: '/links-uteis',
    element: withDashboardLayout(LinksUteis),
  },
  {
    path: '/metas',
    element: withDashboardLayout(Metas),
  },
  {
    path: '/campeoes',
    element: withDashboardLayout(Campeoes),
  },
  {
    path: '/superintendencia',
    element: withDashboardLayout(Superintendencia),
  },
  {
    path: '/perfil',
    element: withDashboardLayout(Perfil),
  },
  {
    path: '/minha-equipe',
    element: withDashboardLayout(MinhaEquipe),
  },
  {
    path: '/comprovantes-equipe',
    element: withDashboardLayout(ComprovantesEquipe),
  },
  {
    path: '/agendamentos',
    element: withDashboardLayout(Agendamentos),
  },
  {
    path: '/pagamentos',
    children: [
      {
        index: true,
        element: withDashboardLayout(Pagamentos),
      },
      {
        path: 'vendas',
        element: withDashboardLayout(Vendas),
      },
      {
        path: 'premiacao',
        element: withDashboardLayout(Premiacao),
      },
      {
        path: 'saldo-cef',
        element: withDashboardLayout(SaldoCef),
      },
      {
        path: 'distratos',
        element: withDashboardLayout(Distratos),
      },
      {
        path: 'outros',
        element: withDashboardLayout(Outros),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
