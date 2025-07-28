import React, { useState } from 'react';
import { Search, Bell, Mail, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
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
  return <header className="h-16 bg-background/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors" />
        
        
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative text-base hover:bg-metro-red/10 hover:text-metro-red hover:shadow-md transition-all duration-300 hover:scale-110">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-metro-red rounded-full text-xs"></span>
        </Button>

        <Button variant="ghost" size="icon" className="relative hover:bg-metro-green/10 hover:text-metro-green hover:shadow-md transition-all duration-300 hover:scale-110">
          <Mail className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-metro-green rounded-full text-xs"></span>
        </Button>

        <VisitButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-3 hover:bg-accent hover:text-accent-foreground hover:shadow-md transition-all duration-300 hover:scale-105 rounded-xl">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileData?.user?.avatar_url || ""} />
                <AvatarFallback className="bg-metro-red text-white text-sm">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                {user?.email ? getUserDisplayName(user.email) : 'Usuário'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-lg border-border">
            <DropdownMenuItem onClick={() => navigate('/perfil')}>
              <User className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
}