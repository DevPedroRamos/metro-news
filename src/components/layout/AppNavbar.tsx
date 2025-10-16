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
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
      <div className="flex items-center space-x-4">
        <SidebarTrigger
          className="h-8 w-8 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Alternar menu lateral"
        />
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <VisitButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-2 md:p-3 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Menu do usuário"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileData?.user?.avatar_url || ""} alt="Foto do perfil" />
                <AvatarFallback className="bg-metro-red text-white text-sm">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user?.email ? getUserDisplayName(user.email) : 'Usuário'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() => navigate('/perfil')}
              className="cursor-pointer focus:bg-gray-100"
            >
              <User className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Meu Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}