import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfMonth, endOfMonth } from 'date-fns';

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

        const validSalesStatuses = [
          'VENDA - SV - VALIDADO DIRETO/NR (SV)',
          'VENDA - SV - VALIDADO CEF (SV)'
        ];

        // Buscar todos os usuários
        const { data: allUsers, error: usersError } = await supabase
          .from('users')
          .select('*');

        if (usersError) throw usersError;

        // Buscar perfis para avatars
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, avatar_url, cpf');

        if (profilesError) throw profilesError;

        const startMonth = startOfMonth(new Date());
        const endMonth = endOfMonth(new Date());

        let rankings: RankingData[] = [];

        if (rankingType === 'corretor') {
          // Ranking individual por corretor
          rankings = await Promise.all(
            allUsers.map(async (user) => {
              const [validSales, contracts, visits] = await Promise.all([
                // Vendas validadas
                supabase
                  .from('sales')
                  .select('sinal')
                  .eq('corretor_cpf', user.cpf)
                  .in('status', validSalesStatuses),
                
                // Contratos (outras vendas)
                supabase
                  .from('sales')
                  .select('id')
                  .eq('corretor_cpf', user.cpf)
                  .not('status', 'in', `(${validSalesStatuses.map(s => `"${s}"`).join(',')})`),
                
                // Visitas do mês
                supabase
                  .from('visits')
                  .select('id')
                  .eq('corretor_id', user.id)
                  .gte('horario_entrada', startMonth.toISOString())
                  .lte('horario_entrada', endMonth.toISOString())
              ]);

              const profile = profiles.find(p => p.cpf === user.cpf);

              return {
                id: user.id,
                name: user.name,
                apelido: user.apelido,
                cpf: user.cpf,
                vendas: validSales.data?.length || 0,
                recebimento: validSales.data?.reduce((sum, sale) => sum + (Number(sale.sinal) || 0), 0) || 0,
                contratos: contracts.data?.length || 0,
                visitas: visits.data?.length || 0,
                avatar_url: profile?.avatar_url
              };
            })
          );
        } else if (rankingType === 'gerente') {
          // Agrupar por gerente
          const managers = [...new Set(allUsers.map(u => u.gerente))].filter(Boolean);
          
          rankings = await Promise.all(
            managers.map(async (gerente) => {
              const corretoresDoGerente = allUsers.filter(u => u.gerente === gerente);
              
              let totalVendas = 0;
              let totalRecebimento = 0;
              let totalContratos = 0;
              let totalVisitas = 0;

              for (const corretor of corretoresDoGerente) {
                const [validSales, contracts, visits] = await Promise.all([
                  supabase
                    .from('sales')
                    .select('sinal')
                    .eq('corretor_cpf', corretor.cpf)
                    .in('status', validSalesStatuses),
                  
                  supabase
                    .from('sales')
                    .select('id')
                    .eq('corretor_cpf', corretor.cpf)
                    .not('status', 'in', `(${validSalesStatuses.map(s => `"${s}"`).join(',')})`),
                  
                  supabase
                    .from('visits')
                    .select('id')
                    .eq('corretor_id', corretor.id)
                    .gte('horario_entrada', startMonth.toISOString())
                    .lte('horario_entrada', endMonth.toISOString())
                ]);

                totalVendas += validSales.data?.length || 0;
                totalRecebimento += validSales.data?.reduce((sum, sale) => sum + (Number(sale.sinal) || 0), 0) || 0;
                totalContratos += contracts.data?.length || 0;
                totalVisitas += visits.data?.length || 0;
              }

              return {
                id: `gerente-${gerente}`,
                name: gerente,
                apelido: gerente,
                vendas: totalVendas,
                recebimento: totalRecebimento,
                contratos: totalContratos,
                visitas: totalVisitas
              };
            })
          );
        } else {
          // Agrupar por superintendente
          const superintendents = [...new Set(allUsers.map(u => u.superintendente))].filter(Boolean);
          
          rankings = await Promise.all(
            superintendents.map(async (superintendente) => {
              const corretoresDoSuperintendente = allUsers.filter(u => u.superintendente === superintendente);
              
              let totalVendas = 0;
              let totalRecebimento = 0;
              let totalContratos = 0;
              let totalVisitas = 0;

              for (const corretor of corretoresDoSuperintendente) {
                const [validSales, contracts, visits] = await Promise.all([
                  supabase
                    .from('sales')
                    .select('sinal')
                    .eq('corretor_cpf', corretor.cpf)
                    .in('status', validSalesStatuses),
                  
                  supabase
                    .from('sales')
                    .select('id')
                    .eq('corretor_cpf', corretor.cpf)
                    .not('status', 'in', `(${validSalesStatuses.map(s => `"${s}"`).join(',')})`),
                  
                  supabase
                    .from('visits')
                    .select('id')
                    .eq('corretor_id', corretor.id)
                    .gte('horario_entrada', startMonth.toISOString())
                    .lte('horario_entrada', endMonth.toISOString())
                ]);

                totalVendas += validSales.data?.length || 0;
                totalRecebimento += validSales.data?.reduce((sum, sale) => sum + (Number(sale.sinal) || 0), 0) || 0;
                totalContratos += contracts.data?.length || 0;
                totalVisitas += visits.data?.length || 0;
              }

              return {
                id: `superintendente-${superintendente}`,
                name: superintendente,
                apelido: superintendente,
                vendas: totalVendas,
                recebimento: totalRecebimento,
                contratos: totalContratos,
                visitas: totalVisitas
              };
            })
          );
        }

        // Ordenar por vendas (e recebimento como desempate)
        rankings.sort((a, b) => {
          if (a.vendas !== b.vendas) {
            return b.vendas - a.vendas;
          }
          return b.recebimento - a.recebimento;
        });

        setAllData(rankings);
        setDisplayedData(rankings.slice(0, ITEMS_PER_PAGE));

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