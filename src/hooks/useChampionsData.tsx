import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentPeriod } from '@/hooks/useCurrentPeriod';

export type RankingType = 'consultor' | 'gerente' | 'superintendente' | 'diretor';

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
  const { period, loading: periodLoading } = useCurrentPeriod();
  const [allData, setAllData] = useState<RankingData[]>([]);
  const [displayedData, setDisplayedData] = useState<RankingData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchChampionsData = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1);

        if (!period?.id || periodLoading) {
          setAllData([]);
          setDisplayedData([]);
          return;
        }

        // Fetch from base_de_vendas filtered by current period
        const { data: baseVendas, error } = await supabase
          .from('base_de_vendas')
          .select('*')
          .eq('periodo_id', period.id);

        if (error) throw error;

        if (!baseVendas || baseVendas.length === 0) {
          setAllData([]);
          setDisplayedData([]);
          return;
        }

        let mappedData: RankingData[] = [];

        if (rankingType === 'consultor') {
          // Group by vendedor_parceiro and count occurrences
          const consultorCounts = baseVendas.reduce((acc, item) => {
            const consultor = item.vendedor_parceiro;
            if (consultor) {
              acc[consultor] = (acc[consultor] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          // Fetch user profiles for consultores
          const { data: users } = await supabase
            .from('users')
            .select('id, apelido, name, cpf')
            .eq('role', 'corretor');

          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, avatar_url');

          mappedData = Object.entries(consultorCounts).map(([consultor, vendas]) => {
            const user = users?.find(u => u.apelido?.toLowerCase() === consultor.toLowerCase());
            const profile = profiles?.find(p => p.id === user?.id);
            
            return {
              id: user?.id || `consultor-${consultor}`,
              name: user?.name || consultor,
              apelido: consultor,
              vendas: vendas,
              recebimento: 0,
              visitas: 0,
              contratos: 0,
              cpf: user?.cpf,
              avatar_url: profile?.avatar_url
            };
          });

        } else if (rankingType === 'gerente') {
          // Group by gerente and count mentions
          const gerenteCounts = baseVendas.reduce((acc, item) => {
            const gerente = item.gerente;
            if (gerente) {
              acc[gerente] = (acc[gerente] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          mappedData = Object.entries(gerenteCounts).map(([gerente, mentions]) => ({
            id: `gerente-${gerente}`,
            name: gerente,
            apelido: gerente,
            vendas: mentions,
            recebimento: 0,
            visitas: 0,
            contratos: 0
          }));

        } else if (rankingType === 'superintendente') {
          // Group by superintendente and count mentions
          const superintendenteCounts = baseVendas.reduce((acc, item) => {
            const superintendente = item.superintendente;
            if (superintendente) {
              acc[superintendente] = (acc[superintendente] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          mappedData = Object.entries(superintendenteCounts).map(([superintendente, mentions]) => ({
            id: `superintendente-${superintendente}`,
            name: superintendente,
            apelido: superintendente,
            vendas: mentions,
            recebimento: 0,
            visitas: 0,
            contratos: 0
          }));

        } else if (rankingType === 'diretor') {
          // Group by diretor and count mentions
          const diretorCounts = baseVendas.reduce((acc, item) => {
            const diretor = item.diretor;
            if (diretor) {
              acc[diretor] = (acc[diretor] || 0) + 1;
            }
            return acc;
          }, {} as Record<string, number>);

          mappedData = Object.entries(diretorCounts).map(([diretor, mentions]) => ({
            id: `diretor-${diretor}`,
            name: diretor,
            apelido: diretor,
            vendas: mentions,
            recebimento: 0,
            visitas: 0,
            contratos: 0
          }));
        }

        // Sort by vendas (sales/mentions) in descending order
        mappedData.sort((a, b) => b.vendas - a.vendas);

        setAllData(mappedData);
        setDisplayedData(mappedData.slice(0, ITEMS_PER_PAGE));

        // Calcular posição do usuário logado
        await calculateUserPosition(mappedData);

      } catch (err) {
        console.error('Error fetching champions data:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchChampionsData();
  }, [rankingType, period?.id, periodLoading]);

  // Função para calcular posição do usuário
  const calculateUserPosition = async (data: RankingData[]) => {
    if (!authUser?.id || !data.length) {
      setUserPosition(null);
      return;
    }
    
    try {
      // Para consultor, buscar por ID
      if (rankingType === 'consultor') {
        const position = data.findIndex(item => item.id === authUser.id);
        setUserPosition(position >= 0 ? position + 1 : null);
        return;
      }
      
      // Para gerente/superintendente/diretor, buscar pelos dados do usuário logado
      const { data: profileData } = await supabase
        .from('profiles')
        .select('cpf')
        .eq('id', authUser.id)
        .single();

      if (!profileData) {
        setUserPosition(null);
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('gerente, superintendente, name')
        .eq('cpf', profileData.cpf)
        .single();

      if (!userData) {
        setUserPosition(null);
        return;
      }

      let searchField = '';
      if (rankingType === 'gerente') {
        searchField = userData.gerente;
      } else if (rankingType === 'superintendente') {
        searchField = userData.superintendente;
      } else if (rankingType === 'diretor') {
        searchField = userData.name; // ou o campo correto para diretor
      }

      const position = data.findIndex(item => item.name === searchField);
      setUserPosition(position >= 0 ? position + 1 : null);
    } catch (error) {
      console.error('Error finding user position:', error);
      setUserPosition(null);
    }
  };

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