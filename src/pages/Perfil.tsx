import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileLoadingSpinner from '@/components/profile/ProfileLoadingSpinner';
import ImageUpload from '@/components/profile/ImageUpload';
import { TrendingUp, DollarSign, FileText, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import defaultCover from '@/assets/default-cover.jpg';
const Perfil = () => {
  const {
    data,
    loading,
    error,
    updateProfileImages
  } = useProfileData();
  if (loading) {
    return <ProfileLoadingSpinner />;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-destructive">Erro ao carregar perfil: {error}</p>
          </CardContent>
        </Card>
      </div>;
  }
  if (!data) {
    return <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p className="text-muted-foreground">Nenhum dado encontrado</p>
          </CardContent>
        </Card>
      </div>;
  }
  const getRankingBadge = (position: number) => {
    if (position === 1) return {
      emoji: '🥇',
      color: 'bg-yellow-500'
    };
    if (position === 2) return {
      emoji: '🥈',
      color: 'bg-gray-400'
    };
    if (position === 3) return {
      emoji: '🥉',
      color: 'bg-amber-600'
    };
    return {
      emoji: '🏅',
      color: 'bg-primary'
    };
  };
  const rankingBadge = getRankingBadge(data.ranking.position);
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };
  return <div className="space-y-6">
      {/* Header Section */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 relative" style={{
          backgroundImage: data.user.cover_url ? `url(${data.user.cover_url})` : `url(${defaultCover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
            <ImageUpload currentImage={data.user.cover_url} onImageUpdate={url => updateProfileImages('cover_url', url)} type="cover" className="top-4 right-4" />
          </div>

          {/* Avatar and Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col items-center sm:items-start -mt-16">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={data.user.avatar_url} />
                  <AvatarFallback className="bg-muted text-2xl font-semibold">
                    {getUserInitials(data.user.name)}
                  </AvatarFallback>
                </Avatar>
                <ImageUpload currentImage={data.user.avatar_url} onImageUpdate={url => updateProfileImages('avatar_url', url)} type="avatar" className="bottom-2 right-2" />
              </div>

              <div className="mt-4 flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-col">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground truncate">
                      {data.user.apelido || data.user.name}
                    </h1>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <p>
                        Superintendência: <strong>{data.user.superintendente}</strong> • Gerência: <strong>{data.user.gerente}</strong> • Cargo: <strong>{data.user.role}</strong>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Badge className={`${rankingBadge.color} text-white text-sm font-semibold`}>
                      {rankingBadge.emoji} {data.ranking.position}º Lugar
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Redesigned Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Row - Contratos Validados and Recebimento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contratos Validados - Featured Card */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Contratos validados</p>
                    <div className="text-4xl font-bold text-primary mb-1">{data.metrics.vendas}</div>
                    <p className="text-xs text-muted-foreground">Vendas válidas realizadas</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recebimento - Gradient Card */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Recebimento</p>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">
                      {formatCurrency(data.metrics.recebimento)}
                    </div>
                    <p className="text-xs text-muted-foreground">Recebimento total</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Visitors Chart */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Total Visitors</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Visitas mensais</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{data.metrics.visitas}</div>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 w-full bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Gráfico de visitas mensais</p>
                  <p className="text-xs text-muted-foreground mt-1">Em desenvolvimento</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sales Funnel */}
        <div className="space-y-6">
          
          {/* Pré-Vendas Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pré-Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">{data.metrics.contratos}</div>
              <p className="text-xs text-muted-foreground">Contratos assinados</p>
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <FileText className="h-4 w-4 mr-1" />
                Todos os contratos
              </div>
            </CardContent>
          </Card>

          {/* Sales Funnel */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Funil de Vendas</CardTitle>
              <p className="text-sm text-muted-foreground">Pipeline de conversão</p>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Visitas */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Visitas</span>
                  <span className="text-sm font-bold">{data.metrics.visitas}</span>
                </div>
                <div className="w-full h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                <div className="absolute -right-2 top-0 h-3 w-3 bg-blue-500 rounded-full"></div>
              </div>

              {/* Pré-Vendas */}
              <div className="relative pl-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Pré-Vendas</span>
                  <span className="text-sm font-bold">{data.metrics.contratos}</span>
                </div>
                <div className="w-5/6 h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"></div>
                <div className="absolute -right-2 top-0 h-3 w-3 bg-purple-500 rounded-full"></div>
              </div>

              {/* Vendas */}
              <div className="relative pl-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Vendas</span>
                  <span className="text-sm font-bold">{data.metrics.vendas}</span>
                </div>
                <div className="w-2/3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                <div className="absolute -right-2 top-0 h-3 w-3 bg-green-500 rounded-full"></div>
              </div>

              {/* Conversion Rate */}
              <div className="pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">
                    {data.metrics.visitas > 0 ? Math.round((data.metrics.vendas / data.metrics.visitas) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">Taxa de conversão</p>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Perfil;