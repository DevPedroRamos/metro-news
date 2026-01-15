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

  // Determina se o usuário pode editar baseado no role
  const canEdit = useMemo(() => {
    return userData?.role === 'gerente';
  }, [userData?.role]);

  const fetchTrips = useCallback(async () => {
    if (!userData?.apelido || !period?.id) {
      setTrips([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const role = userData.role;
      let apelidos: string[] = [];

      if (role === 'gerente') {
        // Gerente vê apenas suas próprias corridas
        apelidos = [userData.apelido];
      } else if (role === 'superintendente') {
        // Superintendente vê corridas de todos os gerentes da sua superintendência
        const { data: gerentesData, error: gerentesError } = await supabase
          .from('users')
          .select('apelido')
          .eq('role', 'gerente')
          .eq('superintendente', userData.apelido);

        if (gerentesError) throw gerentesError;
        apelidos = gerentesData?.map(g => g.apelido) || [];
      } else if (role === 'diretor') {
        // Diretor vê corridas de todos os gerentes da sua diretoria
        // Primeiro busca os superintendentes
        const { data: supsData, error: supsError } = await supabase
          .from('users')
          .select('apelido')
          .eq('role', 'superintendente')
          .eq('diretor', userData.apelido);

        if (supsError) throw supsError;
        const supApelidos = supsData?.map(s => s.apelido) || [];

        if (supApelidos.length > 0) {
          // Depois busca os gerentes desses superintendentes
          const { data: gerentesData, error: gerentesError } = await supabase
            .from('users')
            .select('apelido')
            .eq('role', 'gerente')
            .in('superintendente', supApelidos);

          if (gerentesError) throw gerentesError;
          apelidos = gerentesData?.map(g => g.apelido) || [];
        }
      } else if (role === 'adm') {
        // Admin vê todas as corridas - não filtra por apelido
        const { data, error: fetchError } = await supabase
          .from('uber')
          .select('*')
          .eq('periodo_id', period.id)
          .order('data_transacao', { ascending: false });

        if (fetchError) throw fetchError;
        setTrips(data || []);
        return;
      }

      // Se não encontrou apelidos para buscar
      if (apelidos.length === 0) {
        setTrips([]);
        return;
      }

      // Busca corridas usando OR para múltiplos apelidos com ilike
      const { data, error: fetchError } = await supabase
        .from('uber')
        .select('*')
        .eq('periodo_id', period.id)
        .order('data_transacao', { ascending: false });

      if (fetchError) throw fetchError;

      // Filtra localmente pois ilike com OR não é tão simples
      const filteredTrips = (data || []).filter(trip => 
        apelidos.some(apelido => 
          trip.nome_solicitante?.toLowerCase().includes(apelido.toLowerCase())
        )
      );

      setTrips(filteredTrips);
    } catch (err) {
      console.error('Erro ao buscar corridas Uber:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  }, [userData?.apelido, userData?.role, period?.id]);

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
    // Verifica se pode editar antes de atualizar
    if (!canEdit) {
      toast.error('Você não tem permissão para editar');
      return false;
    }

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
  }, [canEdit]);

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
    canEdit,
    userRole: userData?.role || null,
  };
};
