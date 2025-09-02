import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CommissionData {
  unidade: string;
  venda_data: string;
  empreendimento: string;
  total_corretor: number;
}

interface UseCommissionsDataReturn {
  data: CommissionData[];
  totalToReceive: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCommissionsData = (): UseCommissionsDataReturn => {
  const [data, setData] = useState<CommissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCommissions = async () => {
    if (!user) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Primeiro buscar o CPF do usuário na tabela profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('cpf')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error('Erro ao buscar dados do perfil');
      }

      if (!profileData?.cpf) {
        throw new Error('CPF não encontrado no perfil');
      }

      // Buscar apelido na tabela users usando o CPF
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('apelido')
        .eq('cpf', profileData.cpf)
        .single();

      if (userError) {
        throw new Error('Erro ao buscar dados do usuário');
      }

      if (!userData?.apelido) {
        throw new Error('Apelido não encontrado no perfil');
      }

      // Use base_de_vendas table instead of view to avoid TypeScript issues
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('base_de_vendas')
        .select('unid, data_do_contrato, empreendimento, comissao_integral_sinal')
        .eq('vendedor_parceiro', userData.apelido);

      if (commissionsError) {
        throw new Error('Erro ao buscar comissões');
      }

      const formattedData = commissionsData?.map(item => ({
        unidade: item.unid || '',
        venda_data: item.data_do_contrato || '',
        empreendimento: item.empreendimento || '',
        total_corretor: Number(item.comissao_integral_sinal) || 0,
      })) || [];

      setData(formattedData);
    } catch (err) {
      console.error('Erro ao buscar comissões:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [user]);

  const totalToReceive = data.reduce((sum, commission) => sum + commission.total_corretor, 0);

  return {
    data,
    totalToReceive,
    loading,
    error,
    refetch: fetchCommissions,
  };
};