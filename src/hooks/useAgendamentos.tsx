import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfileUsers } from '@/hooks/useProfileUsers';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export type AgendamentoStatus = 'pendente' | 'confirmado' | 'check_in' | 'cancelado';

export interface Agendamento {
  id: string;
  corretor_id: string;
  corretor_nome: string;
  corretor_cpf: string;
  cliente_nome: string | null;
  cliente_cpf: string | null;
  cliente_telefone: string | null;
  data_visita: string | null;
  empreendimento: string | null;
  loja: string | null;
  andar: string | null;
  mesa: number | null;
  status: AgendamentoStatus;
  token: string;
  expires_at: string | null;
  confirmed_at: string | null;
  checked_in_at: string | null;
  created_at: string;
}

export interface AgendamentosFilters {
  status?: AgendamentoStatus;
  periodo?: 'hoje' | '7dias' | '30dias' | 'todos';
  search?: string;
}

export const useAgendamentos = (filters?: AgendamentosFilters) => {
  const { user } = useAuth();
  const { userData } = useProfileUsers();

  return useQuery({
    queryKey: ['agendamentos', userData?.cpf, userData?.role, filters],
    queryFn: async () => {
      if (!userData?.cpf || !userData?.role) return [];

      const supabaseClient = supabase as any;
      
      // Determinar CPFs permitidos baseado no role
      let allowedCpfs: string[] = [];
      
      if (userData.role === 'corretor') {
        // Corretor vê apenas seus agendamentos
        allowedCpfs = [userData.cpf];
      } else if (userData.role === 'gerente') {
        // Gerente vê agendamentos da equipe
        const { data: teamMembers } = await supabaseClient
          .from('users')
          .select('cpf')
          .eq('gerente', userData.apelido);
        
        allowedCpfs = teamMembers?.map((m: any) => m.cpf) || [];
      } else if (userData.role === 'superintendente') {
        // Superintendente vê agendamentos de toda superintendência
        const { data: teamMembers } = await supabaseClient
          .from('users')
          .select('cpf')
          .eq('superintendente', userData.apelido);
        
        allowedCpfs = teamMembers?.map((m: any) => m.cpf) || [];
      }

      if (allowedCpfs.length === 0) return [];

      let query = supabaseClient
        .from('agendamentos')
        .select('*')
        .in('corretor_cpf', allowedCpfs)
        .order('data_visita', { ascending: false });

      // Filter by status
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      // Filter by period
      if (filters?.periodo) {
        const now = new Date();
        switch (filters.periodo) {
          case 'hoje':
            query = query
              .gte('data_visita', startOfDay(now).toISOString())
              .lte('data_visita', endOfDay(now).toISOString());
            break;
          case '7dias':
            query = query.gte('data_visita', subDays(now, 7).toISOString());
            break;
          case '30dias':
            query = query.gte('data_visita', subDays(now, 30).toISOString());
            break;
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // Client-side search filter
      let filteredData = data || [];
      if (filters?.search && filteredData.length > 0) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (agendamento: any) =>
            agendamento.cliente_nome?.toLowerCase().includes(searchLower) ||
            agendamento.empreendimento?.toLowerCase().includes(searchLower) ||
            agendamento.loja?.toLowerCase().includes(searchLower)
        );
      }

      return filteredData as Agendamento[];
    },
    enabled: !!userData?.cpf && !!userData?.role,
  });
};

export const useAgendamentosStats = () => {
  const { user } = useAuth();
  const { userData } = useProfileUsers();

  return useQuery({
    queryKey: ['agendamentos-stats', userData?.cpf, userData?.role],
    queryFn: async () => {
      if (!userData?.cpf || !userData?.role) return null;

      const supabaseClient = supabase as any;
      const now = new Date();
      const today = startOfDay(now).toISOString();
      const todayEnd = endOfDay(now).toISOString();

      // Determinar CPFs permitidos baseado no role
      let allowedCpfs: string[] = [];
      
      if (userData.role === 'corretor') {
        allowedCpfs = [userData.cpf];
      } else if (userData.role === 'gerente') {
        const { data: teamMembers } = await supabaseClient
          .from('users')
          .select('cpf')
          .eq('gerente', userData.apelido);
        allowedCpfs = teamMembers?.map((m: any) => m.cpf) || [];
      } else if (userData.role === 'superintendente') {
        const { data: teamMembers } = await supabaseClient
          .from('users')
          .select('cpf')
          .eq('superintendente', userData.apelido);
        allowedCpfs = teamMembers?.map((m: any) => m.cpf) || [];
      }

      if (allowedCpfs.length === 0) return { total: 0, hoje: 0, pendentes: 0, confirmados: 0 };

      const [totalRes, todayRes, pendentesRes, confirmadosRes] = await Promise.all([
        supabaseClient
          .from('agendamentos')
          .select('id', { count: 'exact', head: true })
          .in('corretor_cpf', allowedCpfs),
        supabaseClient
          .from('agendamentos')
          .select('id', { count: 'exact', head: true })
          .in('corretor_cpf', allowedCpfs)
          .gte('data_visita', today)
          .lte('data_visita', todayEnd),
        supabaseClient
          .from('agendamentos')
          .select('id', { count: 'exact', head: true })
          .in('corretor_cpf', allowedCpfs)
          .eq('status', 'pendente'),
        supabaseClient
          .from('agendamentos')
          .select('id', { count: 'exact', head: true })
          .in('corretor_cpf', allowedCpfs)
          .eq('status', 'confirmado'),
      ]);

      return {
        total: totalRes.count || 0,
        hoje: todayRes.count || 0,
        pendentes: pendentesRes.count || 0,
        confirmados: confirmadosRes.count || 0,
      };
    },
    enabled: !!userData?.cpf && !!userData?.role,
  });
};
