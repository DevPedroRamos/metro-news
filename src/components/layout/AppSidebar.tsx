
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
  Palette
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
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const menuItems = [
  { title: 'Notícias', url: '/noticias', icon: Newspaper },
  { title: 'Campeões', url: '/campeoes', icon: Trophy },
  { title: 'Treinamento', url: '/treinamento', icon: GraduationCap },
  { title: 'Processos', url: '/processos', icon: Settings },
  { title: 'Links Úteis', url: '/links-uteis', icon: Link },
  { title: 'Superintendência', url: '/superintendencia', icon: Users },
  { title: 'Meu Perfil', url: '/perfil', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border bg-background shadow-lg">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png" 
            alt="Metro News" 
            className="h-auto w-full transition-all duration-300 hover:scale-105"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                          isActive
                            ? 'bg-gradient-to-r from-metro-red to-red-500 text-white shadow-lg transform scale-105'
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-md'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        <SidebarSeparator className="mb-3" />
        <div className="space-y-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
