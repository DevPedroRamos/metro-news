
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  const getUserDisplayName = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace('.', ' ');
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bem-vindo de volta, {user?.email ? getUserDisplayName(user.email) : 'Usuário'}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Portal Corporativo Metro News - Sua central de informações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">📰</span>
              <span>Últimas Notícias</span>
            </CardTitle>
            <CardDescription>
              Mantenha-se atualizado com as novidades da empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              5 novas notícias publicadas hoje
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span>Treinamentos</span>
            </CardTitle>
            <CardDescription>
              Desenvolva suas habilidades com nossos cursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              3 treinamentos disponíveis para você
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">⚙️</span>
              <span>Processos</span>
            </CardTitle>
            <CardDescription>
              Acesse documentos e procedimentos importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              12 processos atualizados esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🏆</span>
              <span>Campeões</span>
            </CardTitle>
            <CardDescription>
              Conheça os destaques do mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ranking dos melhores colaboradores
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">🔗</span>
              <span>Links Úteis</span>
            </CardTitle>
            <CardDescription>
              Acesso rápido a ferramentas importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Links organizados por categoria
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">👥</span>
              <span>Superintendência</span>
            </CardTitle>
            <CardDescription>
              Informações e comunicados da diretoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Últimas atualizações da gestão
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
