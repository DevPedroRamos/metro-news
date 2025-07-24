import React from 'react';
import { Button } from '@/components/ui/button';
import { RankingType } from '@/hooks/useChampionsData';

interface FilterTabsProps {
  activeFilter: RankingType;
  onFilterChange: (filter: RankingType) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'corretor' as RankingType, label: 'Corretor' },
    { key: 'gerente' as RankingType, label: 'Gerente' },
    { key: 'superintendente' as RankingType, label: 'Superintendente' }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? 'default' : 'outline'}
          onClick={() => onFilterChange(filter.key)}
          className="px-6 py-2 font-medium"
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};