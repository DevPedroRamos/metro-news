import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfileUsers } from './useProfileUsers'; // Importando o useProfileUsers

export interface UsePremiosProps {
  periodStart?: string;
  periodEnd?: string;
}

export interface Premiacao {
  id: string;
  descricao_premio_regra: string;
  premiado: string; // Este campo será preenchido com o apelido, se aplicável
  qtd_vendas: number;
  valor_premio: number;
  created_at: string;
}

export function usePremios({ periodStart, periodEnd }: UsePremiosProps = {}) {
  const { userData, loading: userLoading, error: userError } = useProfileUsers(); // Obtendo dados do usuário

  return useQuery<Premiacao[]>({
    queryKey: ['premiacao', periodStart, periodEnd, userData?.id], // Incluímos userData.id na queryKey para reatividade
    queryFn: async () => {
      let query = supabase
        .from('premiacao')
        .select('*')
        .order('created_at', { ascending: false });

      if (periodStart) {
        query = query.gte('created_at', periodStart);
      }

      if (periodEnd) {
        query = query.lte('created_at', periodEnd);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      // Mapeia os dados para substituir o campo premiado pelo apelido, se aplicável
      return data.map((item) => ({
        ...item,
        premiado:
          userData?.id && item.premiado === userData.id && userData.apelido
            ? userData.apelido
            : item.premiado, // Substitui pelo apelido se o premiado corresponder ao userData.id
      }));
    },
    enabled: !userLoading && !userError, // Só executa a query quando o usuário não está carregando e não há erro
  });
}

export function usePremioById(id: string) {
  const { userData, loading: userLoading, error: userError } = useProfileUsers(); // Obtendo dados do usuário

  return useQuery<Premiacao | null>({
    queryKey: ['premiacao', id, userData?.id], // Incluímos userData.id na queryKey
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premiacao')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw new Error(error.message);
      }

      // Substitui o campo premiado pelo apelido, se aplicável
      return {
        ...data,
        premiado:
          userData?.id && data.premiado === userData.id && userData.apelido
            ? userData.apelido
            : data.premiado,
      };
    },
    enabled: !!id && !userLoading && !userError, // Só executa a query se id existe e usuário está carregado sem erros
  });
}