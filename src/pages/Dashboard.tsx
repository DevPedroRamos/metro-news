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
      <div className="text-center py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-metro-red/10 via-metro-blue/10 to-metro-green/10 rounded-3xl blur-3xl -z-10"></div>
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-metro-red to-metro-blue bg-clip-text text-transparent">
          Bem-vindo de volta, {user?.email ? getUserDisplayName(user.email) : 'Usuário'}!
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          🏆 Portal Corporativo Metro News - Sua central de gamificação imobiliária
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/5 border-2 hover:border-metro-red/20 group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                <span className="text-xl">📰</span>
              </div>
              <span className="text-xl font-bold">Últimas Notícias</span>
            </CardTitle>
            <CardDescription>
              Mantenha-se atualizado com as novidades da empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                5 novas notícias publicadas hoje
              </p>
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-bold">
                NOVO
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/5 border-2 hover:border-metro-green/20 group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                <span className="text-xl">🎓</span>
              </div>
              <span className="text-xl font-bold">Treinamentos</span>
            </CardTitle>
            <CardDescription>
              Desenvolva suas habilidades com nossos cursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                3 treinamentos disponíveis para você
              </p>
              <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded-full text-xs font-bold">
                +XP
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/5 border-2 hover:border-purple-500/20 group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                <span className="text-xl">⚙️</span>
              </div>
              <span className="text-xl font-bold">Processos</span>
            </CardTitle>
            <CardDescription>
              Acesse documentos e procedimentos importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                12 processos atualizados esta semana
              </p>
              <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-bold">
                DOCS
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/5 border-2 hover:border-yellow-500/20 group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                <span className="text-xl">🏆</span>
              </div>
              <span className="text-xl font-bold">Campeões</span>
            </CardTitle>
            <CardDescription>
              Conheça os destaques do mês e suba no ranking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Ranking dos melhores colaboradores
              </p>
              <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-bold">
                TOP
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/5 border-2 hover:border-cyan-500/20 group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                <span className="text-xl">🔗</span>
              </div>
              <span className="text-xl font-bold">Links Úteis</span>
            </CardTitle>
            <CardDescription>
              Acesso rápido a ferramentas importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Links organizados por categoria
              </p>
              <div className="bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300 px-2 py-1 rounded-full text-xs font-bold">
                TOOLS
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/5 border-2 hover:border-indigo-500/20 group">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white group-hover:scale-110 transition-transform">
                <span className="text-xl">👥</span>
              </div>
              <span className="text-xl font-bold">Superintendência</span>
            </CardTitle>
            <CardDescription>
              Informações e comunicados da diretoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Últimas atualizações da gestão
              </p>
              <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full text-xs font-bold">
                VIP
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Estatísticas Gamificadas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          🎮 Suas Estatísticas de Jogo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-metro-red/10 to-metro-red/5 border-metro-red/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-metro-red">🔥</div>
              <div className="text-lg font-bold text-foreground">Streak</div>
              <div className="text-sm text-muted-foreground">7 dias consecutivos</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-metro-green/10 to-metro-green/5 border-metro-green/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-metro-green">⭐</div>
              <div className="text-lg font-bold text-foreground">XP</div>
              <div className="text-sm text-muted-foreground">1,250 pontos</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-metro-blue/10 to-metro-blue/5 border-metro-blue/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-metro-blue">🎯</div>
              <div className="text-lg font-bold text-foreground">Meta</div>
              <div className="text-sm text-muted-foreground">75% concluída</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">🏅</div>
              <div className="text-lg font-bold text-foreground">Nível</div>
              <div className="text-sm text-muted-foreground">Corretor Pro</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;