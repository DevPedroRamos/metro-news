import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfileUsers } from './useProfileUsers';
import { useCurrentPeriod } from './useCurrentPeriod';

export interface UsePremiosProps {
  periodStart?: string;
  periodEnd?: string;
}

export interface Premiacao {
  id: string;
  descricao_premio_regra: string;
  premiado: string;
  qtd_vendas: number;
  valor_premio: number;
  created_at: string;
}

export function usePremios({ periodStart, periodEnd }: UsePremiosProps = {}) {
  const { userData, loading: userLoading, error: userError } = useProfileUsers();
  const { period, loading: periodLoading, error: periodError } = useCurrentPeriod();

  return useQuery<Premiacao[]>({
    queryKey: ['premiacao', period?.isoStart, period?.isoEnd, userData?.apelido],
    queryFn: async () => {
      if (!userData?.apelido || !period?.isoStart || !period?.isoEnd) {
        return [];
      }

      console.log('Filtering premiacao with:', {
        apelido: userData.apelido,
        periodStart: period.isoStart,
        periodEnd: period.isoEnd
      });

      const { data, error } = await supabase
        .from('premiacao')
        .select('*')
        .ilike('premiado', userData.apelido)
        .gte('created_at', period.isoStart)
        .lte('created_at', period.isoEnd)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data.map((item) => ({
        id: String(item.id),
        descricao_premio_regra: item.descricao_premio_regra || '',
        premiado: item.premiado || '',
        qtd_vendas: item.qtd_vendas || 0,
        valor_premio: Number(item.valor_premio) || 0,
        created_at: item.created_at || '',
      }));
    },
    enabled: !userLoading && !userError && !periodLoading && !periodError && !!userData?.apelido,
  });
}

export function usePremioById(id: string) {
  const { userData, loading: userLoading, error: userError } = useProfileUsers();

  return useQuery<Premiacao | null>({
    queryKey: ['premiacao', id, userData?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premiacao')
        .select('*')
        .eq('id', Number(id))
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      return {
        id: String(data.id),
        descricao_premio_regra: data.descricao_premio_regra || '',
        premiado: data.premiado || '',
        qtd_vendas: data.qtd_vendas || 0,
        valor_premio: Number(data.valor_premio) || 0,
        created_at: data.created_at || '',
      };
    },
    enabled: !!id && !userLoading && !userError,
  });
}