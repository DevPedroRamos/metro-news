import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentPeriod } from '@/hooks/useCurrentPeriod';

interface ProfileData {
  user: {
    id: string;
    name: string;
    apelido: string;
    cpf: string;
    gerente: string;
    superintendente: string;
    role: string;
    avatar_url?: string;
    cover_url?: string;
  };
  metrics: {
    vendas: number;
    recebimento: number;
    contratos: number;
    visitas: number;
  };
  ranking: {
    position: number;
    total: number;
  };
}

export const useProfileData = () => {
  const { user: authUser } = useAuth();
  const { period, loading: periodLoading } = useCurrentPeriod();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser?.id || !period?.id || periodLoading) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados básicos do usuário
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('cpf', profileData.cpf)
          .single();

        if (userError) throw userError;

        // Buscar vendas do período atual baseado no role do usuário
        let baseVendas;
        let vendasError;
        
        if (userData.role === 'gerente') {
          // Para gerente, buscar vendas onde o apelido dele aparece como gerente
          const result = await supabase
            .from('base_de_vendas')
            .select('*')
            .eq('periodo_id', period.id)
            .eq('gerente', userData.apelido);
          baseVendas = result.data;
          vendasError = result.error;
        } else if (userData.role === 'superintendente') {
          // Para superintendente, buscar vendas onde o apelido dele aparece como superintendente
          const result = await supabase
            .from('base_de_vendas')
            .select('*')
            .eq('periodo_id', period.id)
            .eq('superintendente', userData.apelido);
          baseVendas = result.data;
          vendasError = result.error;
        } else {
          // Para outros usuários, buscar vendas onde ele é o vendedor
          const result = await supabase
            .from('base_de_vendas')
            .select('*')
            .eq('periodo_id', period.id)
            .eq('vendedor_parceiro', userData.name);
          baseVendas = result.data;
          vendasError = result.error;
        }

        if (vendasError) throw vendasError;

        // Buscar visitas do período atual
        const periodStart = new Date(period.isoStart);
        const periodEnd = new Date(period.isoEnd);
        
        let visitsData;
        let visitsError;
        
        if (userData.role === 'superintendente') {
          // Para superintendente, buscar visitas de toda a equipe da superintendência
          const { data: teamUsers, error: teamError } = await supabase
            .from('users')
            .select('id')
            .eq('superintendente', userData.apelido);
          
          if (teamError) throw teamError;
          
          const teamIds = teamUsers?.map(user => user.id) || [];
          
          const result = await supabase
            .from('visits')
            .select('*')
            .in('corretor_id', teamIds)
            .gte('horario_entrada', periodStart.toISOString())
            .lte('horario_entrada', periodEnd.toISOString());
          
          visitsData = result.data;
          visitsError = result.error;
        } else {
          // Para outros usuários, buscar apenas suas próprias visitas
          const result = await supabase
            .from('visits')
            .select('*')
            .eq('corretor_id', authUser.id)
            .gte('horario_entrada', periodStart.toISOString())
            .lte('horario_entrada', periodEnd.toISOString());
          
          visitsData = result.data;
          visitsError = result.error;
        }

        if (visitsError) throw visitsError;

        // Calcular métricas
        const vendas = baseVendas?.length || 0;
        const recebimento = baseVendas?.reduce((sum, item) => sum + (Number(item.recebido) || 0), 0) || 0;
        const contratos = baseVendas?.filter(item => item.tipo_venda?.toLowerCase().includes('contrato')).length || 0;
        const visitas = visitsData?.length || 0;

        // Calcular ranking baseado na mesma lógica do champions para consultores
        let rankingPosition = 1;
        let totalUsers = 1;

        if (userData.role === 'corretor') {
          // Buscar todas as vendas do período para calcular ranking
          const { data: allVendas } = await supabase
            .from('base_de_vendas')
            .select('vendedor_parceiro')
            .eq('periodo_id', period.id);

          if (allVendas) {
            // Contar vendas por vendedor
            const vendedorCounts = allVendas.reduce((acc, item) => {
              if (item.vendedor_parceiro) {
                acc[item.vendedor_parceiro] = (acc[item.vendedor_parceiro] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>);

            // Buscar apenas vendedores que são corretores
            const { data: allUsers } = await supabase
              .from('users')
              .select('name')
              .eq('role', 'corretor');

            if (allUsers) {
              // Filtrar apenas vendedores que são corretores
              const corretorVendas = Object.entries(vendedorCounts)
                .filter(([vendedor]) => allUsers.some(user => user.name === vendedor))
                .map(([vendedor, vendas]) => ({ vendedor, vendas }))
                .sort((a, b) => b.vendas - a.vendas);

              totalUsers = corretorVendas.length;
              const userPosition = corretorVendas.findIndex(item => item.vendedor === userData.name);
              rankingPosition = userPosition >= 0 ? userPosition + 1 : totalUsers;
            }
          }
        } else if (userData.role === 'gerente') {
          // Para gerente, usar campo 'gerente' da base_de_vendas
          const { data: allVendas } = await supabase
            .from('base_de_vendas')
            .select('gerente')
            .eq('periodo_id', period.id);

          if (allVendas) {
            // Contar menções por gerente
            const gerenteCounts = allVendas.reduce((acc, item) => {
              if (item.gerente) {
                acc[item.gerente] = (acc[item.gerente] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>);

            const gerenteVendas = Object.entries(gerenteCounts)
              .map(([gerente, vendas]) => ({ gerente, vendas }))
              .sort((a, b) => b.vendas - a.vendas);

            totalUsers = gerenteVendas.length;
            const userPosition = gerenteVendas.findIndex(item => item.gerente === userData.apelido);
            rankingPosition = userPosition >= 0 ? userPosition + 1 : totalUsers;
          }
        } else if (userData.role === 'superintendente') {
          // Para superintendente, usar campo 'superintendente' da base_de_vendas
          const { data: allVendas } = await supabase
            .from('base_de_vendas')
            .select('superintendente')
            .eq('periodo_id', period.id);

          if (allVendas) {
            // Contar menções por superintendente
            const superintendenteCounts = allVendas.reduce((acc, item) => {
              if (item.superintendente) {
                acc[item.superintendente] = (acc[item.superintendente] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>);

            const superintendenteVendas = Object.entries(superintendenteCounts)
              .map(([superintendente, vendas]) => ({ superintendente, vendas }))
              .sort((a, b) => b.vendas - a.vendas);

            totalUsers = superintendenteVendas.length;
            const userPosition = superintendenteVendas.findIndex(item => item.superintendente === userData.apelido);
            rankingPosition = userPosition >= 0 ? userPosition + 1 : totalUsers;
          }
        }

        setData({
          user: {
            id: userData.id,
            name: userData.name,
            apelido: userData.apelido,
            cpf: userData.cpf,
            gerente: userData.gerente,
            superintendente: userData.superintendente,
            role: userData.role,
            avatar_url: profileData.avatar_url,
            cover_url: profileData.cover_url
          },
          metrics: {
            vendas,
            recebimento,
            contratos,
            visitas
          },
          ranking: {
            position: rankingPosition,
            total: totalUsers
          }
        });

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser?.id, period?.id, periodLoading]);

  const updateProfileImages = async (field: 'avatar_url' | 'cover_url', url: string) => {
    if (!authUser?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: url })
        .eq('id', authUser.id);

      if (error) throw error;

      // Atualizar estado local
      setData(prev => prev ? {
        ...prev,
        user: { ...prev.user, [field]: url }
      } : null);

    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    updateProfileImages
  };
};