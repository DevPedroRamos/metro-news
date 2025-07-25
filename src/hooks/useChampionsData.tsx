import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type RankingType = 'corretor' | 'gerente' | 'superintendente';

interface RankingData {
  id: string;
  name: string;
  apelido: string;
  vendas: number;
  recebimento: number;
  visitas: number;
  contratos: number;
  cpf?: string;
  avatar_url?: string;
}

export const useChampionsData = (rankingType: RankingType) => {
  const { user: authUser } = useAuth();
  const [allData, setAllData] = useState<RankingData[]>([]);
  const [displayedData, setDisplayedData] = useState<RankingData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchChampionsData = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1);

        // Usar função otimizada do PostgreSQL
        const { data: rankingData, error } = await supabase
          .rpc('get_champions_ranking_optimized', {
            ranking_type: rankingType,
            limit_count: 1000, // Buscar todos os dados primeiro
            offset_count: 0
          });

        if (error) throw error;

        if (!rankingData) {
          setAllData([]);
          setDisplayedData([]);
          return;
        }

        // Mapear dados da função para o formato esperado
        const mappedData: RankingData[] = rankingData.map((item: any) => ({
          id: item.user_id || `${rankingType}-${item.name}`,
          name: item.name || item.nickname,
          apelido: item.nickname || item.name,
          vendas: Number(item.sales_count) || 0,
          recebimento: Number(item.revenue) || 0,
          visitas: Number(item.visits_count) || 0,
          contratos: Number(item.contracts_count) || 0,
          avatar_url: item.avatar_url
        }));

        setAllData(mappedData);
        setDisplayedData(mappedData.slice(0, ITEMS_PER_PAGE));

      } catch (err) {
        console.error('Error fetching champions data:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchChampionsData();
  }, [rankingType]);

  // Função para carregar mais dados
  const loadMore = () => {
    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * ITEMS_PER_PAGE;
      
      setDisplayedData(allData.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 500); // Simular delay de carregamento
  };

  // Verificar se há mais dados para carregar
  const hasMore = displayedData.length < allData.length;

  // Encontrar posição do usuário logado
  const userPosition = useMemo(() => {
    if (!authUser?.id || !allData.length) return null;
    
    const position = allData.findIndex(item => {
      if (rankingType === 'corretor') {
        return item.id === authUser.id;
      }
      // Para gerente/superintendente, precisaríamos buscar pelos dados do usuário
      return false;
    });
    
    return position >= 0 ? position + 1 : null;
  }, [allData, authUser?.id, rankingType]);

  return {
    data: displayedData,
    allData,
    loading,
    loadingMore,
    error,
    userPosition,
    loadMore,
    hasMore
  };
};