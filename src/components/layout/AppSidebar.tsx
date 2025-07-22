
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Newspaper, 
  GraduationCap, 
  Settings, 
  Link, 
  Trophy, 
  Users,
  User
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
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Notícias', url: '/noticias', icon: Newspaper },
  { title: 'Treinamento', url: '/treinamento', icon: GraduationCap },
  { title: 'Processos', url: '/processos', icon: Settings },
  { title: 'Links Úteis', url: '/links-uteis', icon: Link },
  { title: 'Campeões', url: '/campeoes', icon: Trophy },
  { title: 'Superintendência', url: '/superintendencia', icon: Users },
  { title: 'Meu Perfil', url: '/perfil', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border bg-white shadow-sm">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png" 
            alt="Metro News" 
            className="h-8 w-auto"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-metro-red text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
