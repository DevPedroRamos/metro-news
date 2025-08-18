import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Newspaper, 
  GraduationCap, 
  Settings, 
  Link, 
  Trophy, 
  Users,
  User,
  CreditCard,
  ChevronDown,
  ChevronRight
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
  { title: 'Campeões', url: '/campeoes', icon: Trophy },
  { title: 'Treinamento', url: '/treinamento', icon: GraduationCap },
  { title: 'Processos', url: '/processos', icon: Settings },
  { title: 'Links Úteis', url: '/links-uteis', icon: Link },
  { title: 'Superintendência', url: '/superintendencia', icon: Users },
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
    ]
  },
  { title: 'Meu Perfil', url: '/perfil', icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const isActive = (path: string, exact = true) => 
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <Sidebar className="border-r border-border bg-white shadow-sm">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png" 
            alt="Metro News" 
            className="h-auto w-full"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {!item.submenu ? (
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive: isActiveLink }) =>
                          `flex items-center space-x-3 px-3 py-5 rounded-lg text-sm font-medium ${
                            isActiveLink
                              ? 'text-metro-red'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-5 rounded-lg text-sm font-medium ${
                          isActive(item.url, false)
                            ? ''
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          <span className="ml-2">
                            {openSubmenu === item.title ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </button>
                      {!isCollapsed && openSubmenu === item.title && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <NavLink
                              key={subItem.title}
                              to={subItem.url}
                              className={({ isActive: isActiveLink }) =>
                                `block px-3 py-2 text-sm rounded-md ${
                                  isActiveLink
                                    ? 'font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`
                              }
                            >
                              {subItem.title}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
