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

      // Buscar comissões na view filtrado pelo CPF
      const { data: commissionsData, error: commissionsError } = await supabase
        .from('v_comissoes')
        .select('unidade, venda_data, empreendimento, total_corretor')
        .eq('corretor', profileData.cpf);

      if (commissionsError) {
        throw new Error('Erro ao buscar comissões');
      }

      setData(commissionsData || []);
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