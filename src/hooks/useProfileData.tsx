import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { startOfMonth, endOfMonth } from 'date-fns';

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
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser?.id) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar dados do perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        // Buscar dados do usuário na tabela users usando o CPF
        const { data: userDetails, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('cpf', profile.cpf)
          .single();

        if (userError) throw userError;

        const userData = {
          id: profile.id,
          name: userDetails.name,
          apelido: userDetails.apelido,
          cpf: userDetails.cpf,
          gerente: userDetails.gerente,
          superintendente: userDetails.superintendente,
          role: userDetails.role,
          avatar_url: profile.avatar_url,
          cover_url: profile.cover_url
        };

        // Buscar vendas válidas
        const validSalesStatuses = [
          'VENDA - SV - VALIDADO DIRETO/NR (SV)',
          'VENDA - SV - VALIDADO CEF (SV)'
        ];

        const { data: validSales, error: validSalesError } = await supabase
          .from('sales')
          .select('sinal')
          .eq('corretor_cpf', userData.cpf)
          .in('status', validSalesStatuses);

        if (validSalesError) throw validSalesError;

        // Buscar contratos (outros status)
        const { data: contracts, error: contractsError } = await supabase
          .from('sales')
          .select('id')
          .eq('corretor_cpf', userData.cpf)
          .not('status', 'in', `(${validSalesStatuses.map(s => `"${s}"`).join(',')})`);

        if (contractsError) throw contractsError;

        // Buscar visitas do mês atual
        const startMonth = startOfMonth(new Date());
        const endMonth = endOfMonth(new Date());

        const { data: monthlyVisits, error: visitsError } = await supabase
          .from('visits')
          .select('id')
          .eq('corretor_id', userDetails.id)
          .gte('horario_entrada', startMonth.toISOString())
          .lte('horario_entrada', endMonth.toISOString());

        if (visitsError) throw visitsError;

        // Calcular ranking - buscar todos os corretores com suas vendas
        const { data: allCorretores, error: rankingError } = await supabase
          .from('users')
          .select('cpf');

        if (rankingError) throw rankingError;

        const corretorSales = await Promise.all(
          allCorretores.map(async (corretor) => {
            const { data: sales } = await supabase
              .from('sales')
              .select('id')
              .eq('corretor_cpf', corretor.cpf)
              .in('status', validSalesStatuses);
            
            return {
              cpf: corretor.cpf,
              salesCount: sales?.length || 0
            };
          })
        );

        // Ordenar por vendas e encontrar posição
        const sortedCorretores = corretorSales
          .sort((a, b) => b.salesCount - a.salesCount);
        
        const userPosition = sortedCorretores.findIndex(c => c.cpf === userData.cpf) + 1;

        const metrics = {
          vendas: validSales?.length || 0,
          recebimento: validSales?.reduce((sum, sale) => sum + (Number(sale.sinal) || 0), 0) || 0,
          contratos: contracts?.length || 0,
          visitas: monthlyVisits?.length || 0
        };

        const ranking = {
          position: userPosition,
          total: allCorretores.length
        };

        setData({
          user: userData,
          metrics,
          ranking
        });

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser?.id]);

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