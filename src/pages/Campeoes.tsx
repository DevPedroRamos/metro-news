import React, { useState } from 'react';
import { useChampionsData, RankingType } from '@/hooks/useChampionsData';
import { useAuth } from '@/hooks/useAuth';
import { FilterTabs } from '@/components/champions/FilterTabs';
import { MotivationalBanner } from '@/components/champions/MotivationalBanner';
import { RankingPodium } from '@/components/champions/RankingPodium';
import { RankingTable } from '@/components/champions/RankingTable';
import { PodiumSkeleton, TableSkeleton } from '@/components/champions/RankingSkeleton';
import ProfileLoadingSpinner from '@/components/profile/ProfileLoadingSpinner';
const Campeoes = () => {
  const {
    user
  } = useAuth();
  const [activeFilter, setActiveFilter] = useState<RankingType>('corretor');
  const {
    data,
    loading,
    error,
    userPosition,
    loadMore,
    hasMore,
    loadingMore
  } = useChampionsData(activeFilter);
  
  if (error) {
    return <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Campeões</h1>
          <p className="text-lg text-muted-foreground">
            Reconhecimento aos nossos melhores colaboradores
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      </div>;
  }
  const topThree = data.slice(0, 3);
  
  return <div className="space-y-6">
      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <MotivationalBanner />

      {loading ? (
        <>
          <PodiumSkeleton />
          <TableSkeleton />
        </>
      ) : (
        <>
          {/* Título da seção com gamificação */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-metro-red via-metro-blue to-metro-green bg-clip-text text-transparent mb-2">
              🏆 HALL DA FAMA
            </h2>
            <p className="text-muted-foreground text-lg">
              Os melhores {activeFilter === 'corretor' ? 'corretores' : activeFilter === 'gerente' ? 'gerentes' : 'superintendentes'} do mês
            </p>
          </div>
          
          <RankingPodium topThree={topThree} />
          
          {/* Separador visual */}
          <div className="flex items-center justify-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <div className="px-4 py-2 bg-accent rounded-full">
              <span className="text-sm font-medium text-accent-foreground">📊 Classificação Geral</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
          
          <RankingTable 
            data={data} 
            userPosition={userPosition} 
            currentUserId={user?.id}
            loadMore={loadMore}
            hasMore={hasMore}
            loadingMore={loadingMore}
          />
        </>
      )}
    </div>;
};
export default Campeoes;