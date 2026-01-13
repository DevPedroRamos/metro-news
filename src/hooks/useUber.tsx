import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileUsers } from '@/hooks/useProfileUsers';
import { useCurrentPeriod } from '@/hooks/useCurrentPeriod';
import { toast } from 'sonner';

export interface UberTrip {
  id: string;
  periodo_id: number | null;
  trip_id: string;
  data_transacao: string | null;
  nome_solicitante: string | null;
  endereco_partida: string | null;
  endereco_destino: string | null;
  codigo_despesa: string | null;
  valor: number | null;
  nome_convidado: string | null;
  sobrenome_convidado: string | null;
  venda_info: string | null;
}

export interface UberStats {
  total: number;
  aguardando: number;
  respondidos: number;
  valorTotal: number;
}

export type UberFilter = 'todos' | 'aguardando' | 'respondidos';

export const useUber = () => {
  const { userData } = useProfileUsers();
  const { period } = useCurrentPeriod();
  const [trips, setTrips] = useState<UberTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<UberFilter>('todos');
  const [updating, setUpdating] = useState(false);

  const fetchTrips = useCallback(async () => {
    if (!userData?.apelido || !period?.id) {
      setTrips([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('uber')
        .select('*')
        .eq('periodo_id', period.id)
        .ilike('nome_solicitante', `%${userData.apelido}%`)
        .order('data_transacao', { ascending: false });

      if (fetchError) throw fetchError;

      setTrips(data || []);
    } catch (err) {
      console.error('Erro ao buscar corridas Uber:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  }, [userData?.apelido, period?.id]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const stats: UberStats = useMemo(() => {
    const total = trips.length;
    const aguardando = trips.filter(t => !t.venda_info).length;
    const respondidos = trips.filter(t => t.venda_info).length;
    const valorTotal = trips.reduce((acc, t) => acc + (t.valor || 0), 0);

    return { total, aguardando, respondidos, valorTotal };
  }, [trips]);

  const filteredTrips = useMemo(() => {
    switch (filter) {
      case 'aguardando':
        return trips.filter(t => !t.venda_info);
      case 'respondidos':
        return trips.filter(t => t.venda_info);
      default:
        return trips;
    }
  }, [trips, filter]);

  const updateVendaInfo = useCallback(async (tripId: string, vendaInfo: string) => {
    try {
      setUpdating(true);

      const { error: updateError } = await supabase
        .from('uber')
        .update({ venda_info: vendaInfo })
        .eq('id', tripId);

      if (updateError) throw updateError;

      // Atualiza localmente
      setTrips(prev => prev.map(t => 
        t.id === tripId ? { ...t, venda_info: vendaInfo } : t
      ));

      toast.success('Resposta salva com sucesso!');
      return true;
    } catch (err) {
      console.error('Erro ao atualizar venda_info:', err);
      toast.error('Erro ao salvar resposta');
      return false;
    } finally {
      setUpdating(false);
    }
  }, []);

  return {
    trips: filteredTrips,
    allTrips: trips,
    stats,
    loading,
    error,
    filter,
    setFilter,
    updating,
    updateVendaInfo,
    refetch: fetchTrips,
  };
};
