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
import { CommissionsTable } from '@/components/profile/CommissionsTable';
import { InvoiceUpload } from '@/components/profile/InvoiceUpload';
import { PaymentHistory } from '@/components/profile/PaymentHistory';
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

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{data.metrics.vendas}</div>
            <p className="text-xs text-muted-foreground">Vendas válidas realizadas</p>
          </CardContent>
        </Card>

        

        

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.metrics.visitas}</div>
            <p className="text-xs text-muted-foreground">Visitas este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Comissões */}
      
    </div>;
};
export default Perfil;