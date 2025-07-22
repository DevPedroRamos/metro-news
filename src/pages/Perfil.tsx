
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Perfil = () => {
  const { user } = useAuth();

  const getUserInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace('.', ' ');
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
        <p className="text-lg text-muted-foreground">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-metro-red text-white text-lg">
                  {user?.email ? getUserInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {user?.email ? getUserDisplayName(user.email) : 'Usuário'}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </CardTitle>
            <CardDescription>
              Suas informações de perfil e configurações da conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Em breve, você poderá editar suas informações pessoais e preferências do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
