"use client"
import { NavLink, useLocation } from "react-router-dom"
import {
  Newspaper,
  GraduationCap,
  Settings,
  Link,
  Trophy,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from "lucide-react"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  {
    title: "Notícias",
    url: "/noticias",
    icon: Newspaper,
    badge: "3",
    description: "Últimas atualizações",
  },
  {
    title: "Campeões",
    url: "/campeoes",
    icon: Trophy,
    description: "Hall da fama",
  },
  {
    title: "Treinamento",
    url: "/treinamento",
    icon: GraduationCap,
    badge: "Novo",
    description: "Cursos e capacitação",
  },
  {
    title: "Processos",
    url: "/processos",
    icon: Settings,
    description: "Documentação interna",
  },
  {
    title: "Links Úteis",
    url: "/links-uteis",
    icon: Link,
    description: "Recursos externos",
  },
  {
    title: "Superintendência",
    url: "/superintendencia",
    icon: Users,
    description: "Gestão e liderança",
  },
  {
    title: "Meu Perfil",
    url: "/perfil",
    icon: User,
    description: "Configurações pessoais",
  },
]

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar()
  const location = useLocation()
  const isCollapsed = state === "collapsed"
  const isActive = (path: string) => location.pathname === path

  return (
    <Sidebar className="border-r-0 bg-gradient-to-b from-white via-gray-50/50 to-white shadow-xl">
      {/* Header */}
      <SidebarHeader className="relative p-6 bg-gradient-to-r from-red-600 to-red-700">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-red-800/30" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <img
                  src="/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png"
                  alt="Metro News"
                  className="h-8 w-8 object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="text-white">
                  <h1 className="text-lg font-bold tracking-wide">METRO NEWS</h1>
                  <p className="text-xs text-red-100 opacity-90">Portal Corporativo</p>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isItemActive = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) => {
                          const baseClasses =
                            "group relative flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                          const activeClasses =
                            "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                          const inactiveClasses =
                            "text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700"

                          return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
                        }}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div
                            className={`p-1.5 rounded-lg transition-colors ${
                              isItemActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-red-100"
                            }`}
                          >
                            <item.icon
                              className={`h-4 w-4 transition-colors ${
                                isItemActive ? "text-white" : "text-gray-600 group-hover:text-red-600"
                              }`}
                            />
                          </div>

                          {!isCollapsed && (
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{item.title}</span>
                                {item.badge && (
                                  <Badge
                                    variant={isItemActive ? "secondary" : "default"}
                                    className={`text-xs px-2 py-0.5 ${
                                      isItemActive
                                        ? "bg-white/20 text-white border-white/30"
                                        : "bg-red-100 text-red-700 border-red-200"
                                    }`}
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p
                                className={`text-xs mt-0.5 transition-colors ${
                                  isItemActive ? "text-red-100" : "text-gray-500 group-hover:text-red-600"
                                }`}
                              >
                                {item.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Active indicator */}
                        {isItemActive && (
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <>
            <Separator className="my-6 bg-gray-200" />

            {/* Quick Actions */}
            <SidebarGroup>
              <div className="px-2 mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações Rápidas</h3>
              </div>
              <SidebarGroupContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 bg-transparent"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notificações
                    <Badge variant="destructive" className="ml-auto text-xs px-1.5 py-0.5">
                      2
                    </Badge>
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-gray-200 bg-gray-50/50">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                JS
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">João Silva</p>
                <p className="text-xs text-gray-500 truncate">joao.silva@metrocasa.com.br</p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full p-2 hover:bg-red-50">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                JS
              </div>
            </Button>
            <Button variant="ghost" size="sm" className="w-full p-2 hover:bg-red-50 text-gray-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
