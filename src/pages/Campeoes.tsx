
import React, { useState } from 'react';
import { useChampionsData, RankingType } from '@/hooks/useChampionsData';
import { useAuth } from '@/hooks/useAuth';
import { FilterTabs } from '@/components/champions/FilterTabs';
import { MotivationalBanner } from '@/components/champions/MotivationalBanner';
import { RankingPodium } from '@/components/champions/RankingPodium';
import { RankingTable } from '@/components/champions/RankingTable';
import ProfileLoadingSpinner from '@/components/profile/ProfileLoadingSpinner';

const Campeoes = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<RankingType>('corretor');
  const { data, loading, error, userPosition } = useChampionsData(activeFilter);

  if (loading) {
    return <ProfileLoadingSpinner />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Campeões</h1>
          <p className="text-lg text-muted-foreground">
            Reconhecimento aos nossos melhores colaboradores
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  const topThree = data.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Campeões</h1>
        <p className="text-lg text-muted-foreground">
          Reconhecimento aos nossos melhores colaboradores
        </p>
      </div>

      <FilterTabs 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

      <MotivationalBanner />

      <RankingPodium topThree={topThree} />

      <RankingTable 
        data={data} 
        userPosition={userPosition}
        currentUserId={user?.id}
      />
    </div>
  );
};

export default Campeoes;
