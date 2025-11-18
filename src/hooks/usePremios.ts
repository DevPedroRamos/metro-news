import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useProfileUsers } from './useProfileUsers';
import { useCurrentPeriod } from './useCurrentPeriod';

export interface UsePremiosProps {
  periodStart?: string;
  periodEnd?: string;
  viewAsAdmin?: boolean;
}

export interface Premiacao {
  id: string;
  descricao_premio_regra: string;
  premiado: string;
  qtd_vendas: number;
  valor_premio: number;
  created_at: string;
}

export function usePremios({ periodStart, periodEnd, viewAsAdmin = false }: UsePremiosProps = {}) {
  const { userData, loading: userLoading, error: userError } = useProfileUsers();
  const { period, loading: periodLoading, error: periodError } = useCurrentPeriod();

  return useQuery<Premiacao[]>({
    queryKey: ['premiacao', period?.id, userData?.apelido],
    queryFn: async () => {
      if (!userData?.apelido || !period?.id || period.id <= 0) {
        return [];
      }

      console.log('Filtering premiacao with:', {
        apelido: userData.apelido,
        periodId: period.id
      });

      let query = supabase
        .from('premiacao')
        .select('*')
        .eq('periodo_id', period.id);

      // Buscar superintendentes da diretoria
      const { data: superintendentes } = await supabase
        .from("users")
        .select("apelido")
        .eq("role", "superintendente")
        .eq("diretor", userData.apelido);

      const superList = superintendentes?.map(s => s.apelido) || [];

      if (superList.length > 0) {
        // Buscar apelidos de todos os usuários dessa diretoria
        const { data: teamUsers } = await supabase
          .from("users")
          .select("apelido")
          .in("superintendente", superList);

        const apelidoList = teamUsers?.map(u => u.apelido) || [];

        // Adicionar os próprios superintendentes à lista
        apelidoList.push(...superList);

        if (apelidoList.length > 0) {
          query = query.in('premiado', apelidoList);
        }
      }

      // Filtrar por apelido apenas se não for admin
      if (!viewAsAdmin) {
        query = query.ilike('premiado', userData.apelido);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

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
    enabled: !userLoading && !userError && !periodLoading && !periodError && (viewAsAdmin || !!userData?.apelido) && !!period?.id && period.id > 0,
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