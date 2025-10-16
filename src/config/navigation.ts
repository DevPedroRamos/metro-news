import {
  Newspaper,
  GraduationCap,
  Settings,
  Link,
  Trophy,
  Users,
  User,
  CreditCard,
  Target,
  UserCheck,
  FileText,
  Calendar,
  type LucideIcon
} from 'lucide-react';

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  submenu?: NavigationSubItem[];
  roles?: string[];
}

export interface NavigationSubItem {
  title: string;
  url: string;
}

export const mainNavigation: NavigationItem[] = [
  {
    title: 'Notícias',
    url: '/noticias',
    icon: Newspaper
  },
  {
    title: 'Campeões',
    url: '/campeoes',
    icon: Trophy
  },
  {
    title: 'Agendamentos',
    url: '/agendamentos',
    icon: Calendar
  },
  {
    title: 'Links',
    url: '/links-uteis',
    icon: Link
  },
  {
    title: 'Metas',
    url: '/metas',
    icon: Target
  },
  {
    title: 'Pagamentos',
    url: '/pagamentos',
    icon: CreditCard,
    submenu: [
      { title: 'Resumo', url: '/pagamentos' },
      { title: 'Vendas', url: '/pagamentos/vendas' },
      { title: 'Premiação', url: '/pagamentos/premiacao' },
      { title: 'Saldo CEF', url: '/pagamentos/saldo-cef' },
      { title: 'Distratos', url: '/pagamentos/distratos' },
      { title: 'Outros', url: '/pagamentos/outros' },
    ]
  },
  {
    title: 'Meu Perfil',
    url: '/perfil',
    icon: User
  },
];

export const managerNavigation: NavigationItem[] = [
  {
    title: 'Minha Equipe',
    url: '/minha-equipe',
    icon: UserCheck,
    roles: ['gerente', 'superintendente'],
  },
  {
    title: 'Comprovantes',
    url: '/comprovantes-equipe',
    icon: FileText,
    roles: ['gerente', 'superintendente'],
  },
];

export const getNavigationForRole = (role?: string): NavigationItem[] => {
  const baseNav = [...mainNavigation];

  if (role === 'gerente' || role === 'superintendente') {
    return [...baseNav, ...managerNavigation];
  }

  return baseNav;
};
