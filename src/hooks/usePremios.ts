import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UsePremiosProps {
  periodStart?: string;
  periodEnd?: string;
}

export interface Premiacao {
  id: string;
  descricao_premio_regra: string;
  premiado: string;
  funcao: string;
  gerente: string;
  gestor: string;
  qtd_vendas: number;
  valor_premio: number;
  created_at: string;
}

export function usePremios({ periodStart, periodEnd }: UsePremiosProps = {}) {
  return useQuery<Premiacao[]>({
    queryKey: ['premiacao', periodStart, periodEnd],
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

      return data;
    },
  });
}

export function usePremioById(id: string) {
  return useQuery<Premiacao | null>({
    queryKey: ['premiacao', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('premiacao')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id,
  });
}