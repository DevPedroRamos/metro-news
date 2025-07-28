import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { 
  Trophy, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Settings, 
  Link2, 
  Crown,
  Star,
  Award,
  Flame
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const getUserDisplayName = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace('.', ' ');
  };

  const gameStats = [
    { label: 'Streak', value: '7 dias', icon: Flame, color: 'from-orange-500 to-red-500', bgColor: 'from-orange-500/10 to-red-500/10' },
    { label: 'XP Total', value: '1,250', icon: Zap, color: 'from-green-500 to-emerald-500', bgColor: 'from-green-500/10 to-emerald-500/10' },
    { label: 'Meta Mensal', value: '75%', icon: Target, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-500/10 to-cyan-500/10' },
    { label: 'Ranking', value: '#12', icon: Trophy, color: 'from-yellow-500 to-orange-500', bgColor: 'from-yellow-500/10 to-orange-500/10' },
  ];

  const menuCards = [
    {
      title: 'Últimas Notícias',
      description: 'Mantenha-se atualizado com as novidades da empresa',
      icon: BookOpen,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      borderColor: 'border-blue-500/20',
      stats: '5 novas notícias hoje',
      badge: { text: 'NOVO', color: 'bg-blue-500 text-white' },
      url: '/noticias'
    },
    {
      title: 'Campeões',
      description: 'Conheça os destaques do mês e suba no ranking',
      icon: Trophy,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/5',
      borderColor: 'border-yellow-500/20',
      stats: 'Você está em #12',
      badge: { text: 'HOT', color: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' },
      url: '/campeoes'
    },
    {
      title: 'Treinamentos',
      description: 'Desenvolva suas habilidades com nossos cursos',
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/5',
      borderColor: 'border-green-500/20',
      stats: '3 cursos disponíveis',
      badge: { text: '+XP', color: 'bg-green-500 text-white' },
      url: '/treinamento'
    },
    {
      title: 'Processos',
      description: 'Acesse documentos e procedimentos importantes',
      icon: Settings,
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-500/10 to-violet-500/5',
      borderColor: 'border-purple-500/20',
      stats: '12 processos atualizados',
      badge: { text: 'DOCS', color: 'bg-purple-500 text-white' },
      url: '/processos'
    },
    {
      title: 'Links Úteis',
      description: 'Acesso rápido a ferramentas importantes',
      icon: Link2,
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-500/10 to-blue-500/5',
      borderColor: 'border-cyan-500/20',
      stats: 'Links organizados',
      badge: { text: 'TOOLS', color: 'bg-cyan-500 text-white' },
      url: '/links-uteis'
    },
    {
      title: 'Superintendência',
      description: 'Informações e comunicados da diretoria',
      icon: Crown,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/5',
      borderColor: 'border-indigo-500/20',
      stats: 'Comunicados VIP',
      badge: { text: 'VIP', color: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' },
      url: '/superintendencia'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Hero Section */}
      <div className="text-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-metro-red/10 via-metro-blue/10 to-metro-green/10 rounded-3xl blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl -z-10 animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -z-10 animate-float" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-bold animate-bounce-in">
              🎮 MODO GAMIFICAÇÃO ATIVO
            </Badge>
          </div>
          
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-metro-red via-metro-blue to-metro-green bg-clip-text text-transparent animate-fade-in">
          Bem-vindo de volta, {user?.email ? getUserDisplayName(user.email) : 'Usuário'}!
        </h1>
        <p className="text-xl text-muted-foreground font-medium animate-slide-in">
          🏆 Portal Corporativo Metro News - Sua central de gamificação imobiliária
        </p>
        
        {/* Quick Stats */}
        <div className="flex items-center justify-center mt-8 space-x-6">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-400/30">
            <Trophy className="h-5 w-5 text-yellow-500 animate-glow" />
            <span className="font-bold text-foreground">Nível 12</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-400/20 to-emerald-500/20 px-4 py-2 rounded-full border border-green-400/30">
            <Star className="h-5 w-5 text-green-500" />
            <span className="font-bold text-foreground">1,250 XP</span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-400/20 to-pink-500/20 px-4 py-2 rounded-full border border-purple-400/30">
            <Award className="h-5 w-5 text-purple-500" />
            <span className="font-bold text-foreground">Ranking #12</span>
          </div>
        </div>
      </div>

      {/* Seção de Estatísticas Gamificadas */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-metro-red via-metro-blue to-metro-green bg-clip-text text-transparent">
          🎮 Suas Estatísticas de Jogo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gameStats.map((stat, index) => (
            <Card key={stat.label} className={`bg-gradient-to-br ${stat.bgGradient} border-2 border-transparent hover:border-opacity-50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                {stat.label === 'Meta Mensal' && (
                  <div className="mt-3">
                    <Progress value={75} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Menu Cards */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-metro-red via-metro-blue to-metro-green bg-clip-text text-transparent">
          🚀 Central de Comando
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuCards.map((card, index) => (
            <Card key={card.title} className={`hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 bg-gradient-to-br ${card.bgGradient} border-2 ${card.borderColor} group cursor-pointer relative overflow-hidden animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Efeito de brilho animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 bg-gradient-to-br ${card.gradient} rounded-xl text-white group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold">{card.title}</span>
                  </div>
                  <Badge className={`${card.badge.color} animate-pulse`}>
                    {card.badge.text}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-base">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground font-medium">
                    {card.stats}
                  </p>
                  <TrendingUp className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform" />
                </div>
                
                {/* Progress bar para alguns cards */}
                {card.title === 'Campeões' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progresso para Top 10</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Achievement Banner */}
      <div className="mt-16">
        <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
          <CardContent className="p-8 text-center relative z-10">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-yellow-200 animate-glow mr-4" />
              <div>
                <h3 className="text-2xl font-bold">Conquista Desbloqueada!</h3>
                <p className="text-yellow-100">Você completou 7 dias consecutivos de atividade</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm font-bold">
              +50 XP Bônus
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;