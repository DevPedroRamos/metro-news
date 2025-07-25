import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ActiveVisit {
  id: string;
  cliente_nome: string;
  cliente_cpf: string;
  mesa: number;
  loja: string;
  andar: string;
  empreendimento?: string;
  horario_entrada: string;
}

export const useActiveVisits = () => {
  const [visits, setVisits] = useState<ActiveVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchActiveVisits = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('corretor_id', user.id)
        .eq('status', 'ativo')
        .order('horario_entrada', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar visitas');
    } finally {
      setLoading(false);
    }
  };

  const finalizeVisit = async (visitId: string) => {
    try {
      const { error } = await supabase.rpc('finalizar_visita', { visit_id: visitId });
      
      if (error) throw error;
      
      toast({
        title: "Visita finalizada!",
        description: "A visita foi finalizada com sucesso."
      });
      
      // Refresh the list
      await fetchActiveVisits();
    } catch (err) {
      toast({
        title: "Erro ao finalizar visita",
        description: err instanceof Error ? err.message : 'Erro desconhecido',
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchActiveVisits();

    // Set up real-time subscription
    const channel = supabase
      .channel('active-visits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visits',
          filter: `corretor_id=eq.${user.id}`
        },
        () => {
          fetchActiveVisits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    visits,
    loading,
    error,
    finalizeVisit,
    refetch: fetchActiveVisits
  };
};