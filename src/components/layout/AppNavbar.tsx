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
import { ModeToggle } from '@/components/theme/ModeToggle';

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
  return <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="h-8 w-8" />
        
        
      </div>

      <div className="flex items-center space-x-4">
        {/* <Button variant="ghost" size="icon" className="relative text-base hover:bg-[#FF000F]/70 hover:shadow-md transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-metro-red rounded-full text-xs"></span>
        </Button>

        <Button variant="ghost" size="icon" className="relative hover:bg-[#FF000F]/70 hover:shadow-md transition-all">
          <Mail className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-metro-green rounded-full text-xs"></span>
        </Button> */}

        <ModeToggle />
        <VisitButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-3 hover:bg-[#000000]/10 hover:shadow-md transition-all">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileData?.user?.avatar_url || ""} />
                <AvatarFallback className="bg-metro-red text-white text-sm">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                {user?.email ? getUserDisplayName(user.email) : 'Usuário'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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