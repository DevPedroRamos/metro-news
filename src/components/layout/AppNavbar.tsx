import React, { useState } from 'react';
import { Search, Bell, Mail, LogOut, User, Zap, Trophy, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useProfileData } from '@/hooks/useProfileData';
import { signOut } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { VisitButton } from '@/components/visits/VisitButton';

export function AppNavbar() {
  const {
    user
  } = useAuth();
  const { data: profileData } = useProfileData();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSignOut = async () => {
    const {
      error
    } = await signOut();
    if (!error) {
      toast({
        title: "Logout realizado com sucesso!",
        description: "Até mais!"
      });
      navigate('/login');
    }
  };
  
  const getUserInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };
  
  const getUserDisplayName = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace('.', ' ');
  };
  
  return <header className="h-16 bg-gradient-to-r from-background via-background to-accent/5 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110 hover:shadow-md rounded-lg" />
        
        {/* Barra de busca gamificada */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="🔍 Buscar no portal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-background/50 border-border/50 focus:border-metro-blue focus:ring-metro-blue/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Estatísticas rápidas */}
        <div className="hidden lg:flex items-center space-x-3 mr-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-bold text-foreground">Nível 12</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-400/10 to-blue-500/10 px-3 py-1.5 rounded-full border border-green-400/20">
            <Zap className="h-4 w-4 text-green-500" />
            <span className="text-sm font-bold text-foreground">1,250 XP</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-400/10 to-pink-500/10 px-3 py-1.5 rounded-full border border-purple-400/20">
            <Target className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-bold text-foreground">75%</span>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" className="relative text-base hover:bg-metro-red/10 hover:text-metro-red hover:shadow-lg transition-all duration-300 hover:scale-110 rounded-xl group">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-metro-red to-red-500 text-white text-xs p-0 flex items-center justify-center animate-pulse">
            3
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-r from-metro-red/0 via-metro-red/20 to-metro-red/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>

        <Button variant="ghost" size="icon" className="relative hover:bg-metro-green/10 hover:text-metro-green hover:shadow-lg transition-all duration-300 hover:scale-110 rounded-xl group">
          <Mail className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-metro-green to-green-500 text-white text-xs p-0 flex items-center justify-center animate-pulse">
            7
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-r from-metro-green/0 via-metro-green/20 to-metro-green/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>

        <VisitButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 px-4 py-2 hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 hover:text-accent-foreground hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl border border-transparent hover:border-accent/20 group">
              <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-metro-blue/30 transition-all duration-300">
                <AvatarImage src={profileData?.user?.avatar_url || ""} />
                <AvatarFallback className="bg-gradient-to-br from-metro-red to-red-500 text-white text-sm font-bold">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-foreground">
                  {user?.email ? getUserDisplayName(user.email) : 'Usuário'}
                </span>
                <span className="text-xs text-muted-foreground">Corretor Pro</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 shadow-xl border-border bg-background/95 backdrop-blur-sm">
            <div className="p-3 border-b border-border">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profileData?.user?.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-metro-red to-red-500 text-white font-bold">
                    {user?.email ? getUserInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {user?.email ? getUserDisplayName(user.email) : 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'usuario@metrocasa.com.br'}
                  </p>
                </div>
              </div>
              
              {/* Mini estatísticas */}
              <div className="flex items-center justify-between mt-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  <span>Nível 12</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-green-500" />
                  <span>1,250 XP</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-3 w-3 text-purple-500" />
                  <span>75%</span>
                </div>
              </div>
            </div>
            
            <DropdownMenuItem onClick={() => navigate('/perfil')} className="hover:bg-accent/50 transition-colors">
              <User className="mr-2 h-4 w-4" />
              <span>Ver Perfil Completo</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
}