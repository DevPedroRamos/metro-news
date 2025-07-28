
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Newspaper, 
  GraduationCap, 
  Settings, 
  Link, 
  Trophy, 
  Users,
  User,
  Palette,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Badge } from '@/components/ui/badge';

const gameMenuItems = [
  { 
    title: 'Campeões', 
    url: '/campeoes', 
    icon: Trophy, 
    badge: 'HOT',
    badgeColor: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    description: 'Rankings e competições'
  },
  { 
    title: 'Meu Perfil', 
    url: '/perfil', 
    icon: User, 
    badge: 'XP',
    badgeColor: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    description: 'Suas estatísticas'
  },
];

const workMenuItems = [
  { 
    title: 'Notícias', 
    url: '/noticias', 
    icon: Newspaper,
    badge: '5',
    badgeColor: 'bg-metro-red text-white',
    description: 'Últimas atualizações'
  },
  { 
    title: 'Treinamento', 
    url: '/treinamento', 
    icon: GraduationCap,
    badge: 'NEW',
    badgeColor: 'bg-metro-green text-white',
    description: 'Cursos e capacitação'
  },
  { 
    title: 'Processos', 
    url: '/processos', 
    icon: Settings,
    description: 'Documentação'
  },
  { 
    title: 'Links Úteis', 
    url: '/links-uteis', 
    icon: Link,
    description: 'Ferramentas rápidas'
  },
  { 
    title: 'Superintendência', 
    url: '/superintendencia', 
    icon: Users,
    badge: 'VIP',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    description: 'Comunicados da diretoria'
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: any, index: number) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
              isActive
                ? 'bg-gradient-to-r from-metro-red via-red-500 to-metro-red text-white shadow-lg transform scale-105 glow-effect'
                : 'text-foreground hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-accent-foreground hover:scale-105 hover:shadow-md'
            }`
          }
        >
          {/* Efeito de brilho animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          
          <div className="relative flex items-center w-full">
            <item.icon className={`h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
              item.title === 'Campeões' ? 'trophy-glow' : ''
            }`} />
            
            {!isCollapsed && (
              <>
                <div className="flex-1 ml-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{item.title}</span>
                    {item.badge && (
                      <Badge className={`text-xs px-2 py-0.5 ${item.badgeColor} animate-pulse`}>
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs opacity-70 mt-0.5">{item.description}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className="border-r border-border bg-gradient-to-b from-background via-background to-accent/5 shadow-2xl">
      <SidebarHeader className="p-6 border-b border-border bg-gradient-to-r from-metro-red/5 via-metro-blue/5 to-metro-green/5">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png" 
            alt="Metro News" 
            className={`transition-all duration-300 hover:scale-105 ${
              isCollapsed ? 'h-8 w-8' : 'h-auto w-full max-w-[180px]'
            }`}
          />
        </div>
        {!isCollapsed && (
          <div className="mt-3 text-center">
            <p className="text-xs font-medium text-muted-foreground">
              🎮 Portal Gamificado
            </p>
            <div className="flex items-center justify-center mt-2 space-x-2">
              <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 
                text-white px-2 py-1 rounded-full text-xs font-bold level-badge">
                <Zap className="h-3 w-3" />
                <span>Nível Pro</span>
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        {/* Seção Gamificação */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-bold text-metro-red uppercase tracking-wider mb-3 flex items-center">
            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
            {!isCollapsed && "🏆 Gamificação"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {gameMenuItems.map((item, index) => renderMenuItem(item, index))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Seção Trabalho */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-metro-blue uppercase tracking-wider mb-3 flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
            {!isCollapsed && "💼 Trabalho"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {workMenuItems.map((item, index) => renderMenuItem(item, index))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border bg-gradient-to-r from-accent/5 to-secondary/5">
        <SidebarSeparator className="mb-3 bg-gradient-to-r from-transparent via-border to-transparent" />
        
        {/* Estatísticas rápidas quando não colapsado */}
        {!isCollapsed && (
          <div className="mb-4 p-3 bg-gradient-to-r from-metro-green/10 to-metro-blue/10 rounded-xl border border-metro-green/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">XP Hoje:</span>
              <span className="font-bold text-metro-green">+125</span>
            </div>
            <div className="mt-2 bg-muted rounded-full h-2 overflow-hidden">
              <div className="xp-bar h-full w-3/4 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">Nível 12</span>
              <span className="text-muted-foreground">875/1000</span>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
