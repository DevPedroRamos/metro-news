import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useProfileUsers } from '@/hooks/useProfileUsers';
import { getNavigationForRole } from '@/config/navigation';
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

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { userData } = useProfileUsers();

  const menuItems = getNavigationForRole(userData?.role);

  useEffect(() => {
    const activeSubmenu = menuItems.find(
      (item) => item.submenu && location.pathname.startsWith(item.url)
    );
    if (activeSubmenu) {
      setOpenSubmenu(activeSubmenu.title);
    }
  }, [location.pathname, menuItems]);

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
            alt="Metro News Portal Logo"
            className="h-auto w-full"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1" role="navigation" aria-label="Menu principal">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {!item.submenu ? (
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive: isActiveLink }) =>
                          `flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            isActiveLink
                              ? 'text-metro-red bg-red-50'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`
                        }
                        aria-label={item.title}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          isActive(item.url, false)
                            ? 'text-metro-red bg-red-50'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        aria-expanded={openSubmenu === item.title}
                        aria-label={`${item.title} menu`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          <span className="ml-2 transition-transform duration-200" aria-hidden="true">
                            {openSubmenu === item.title ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </button>
                      {!isCollapsed && openSubmenu === item.title && (
                        <div className="ml-8 mt-1 space-y-1 animate-fade-in" role="menu">
                          {item.submenu.map((subItem) => (
                            <NavLink
                              key={subItem.title}
                              to={subItem.url}
                              className={({ isActive: isActiveLink }) =>
                                `block px-3 py-2 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                  isActiveLink
                                    ? 'font-medium text-metro-red bg-red-50'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                              }
                              role="menuitem"
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
