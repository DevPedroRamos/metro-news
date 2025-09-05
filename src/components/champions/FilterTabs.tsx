import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RankingType } from '@/hooks/useChampionsData';

interface FilterTabsProps {
  activeFilter: RankingType;
  onFilterChange: (filter: RankingType) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <Tabs value={activeFilter} onValueChange={(value) => onFilterChange(value as RankingType)} className="mb-6">
      <TabsList className="grid w-full max-w-3xl grid-cols-4">
        <TabsTrigger value="consultor">Consultor</TabsTrigger>
        <TabsTrigger value="gerente">Gerente</TabsTrigger>
        <TabsTrigger value="superintendente">Superintendente</TabsTrigger>
        <TabsTrigger value="diretor">Diretor</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};