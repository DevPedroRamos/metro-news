import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileUsers } from '@/hooks/useProfileUsers';
import { useCurrentPeriod } from '@/hooks/useCurrentPeriod';

export interface TeamMember {
  id: string;
  name: string;
  apelido: string;
  cpf: string;
  role: string;
  avatar_url?: string;
  vendas: number;
  valorRecebido: number;
  visitas: number;
  contratos: number;
  valorAReceber: number;
  comissao: number;
  premio: number;
  saldoCef: number;
  distrato: number;
  valorNota: number;
}

export const useMinhaEquipe = () => {
  const { userData } = useProfileUsers();
  const { period } = useCurrentPeriod();
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [totalVendasEquipe, setTotalVendasEquipe] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userData?.apelido || (userData.role !== 'gerente' && userData.role !== 'superintendente') || !period) return;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        let teamMembers;
        let teamError;

        if (userData.role === 'gerente') {
          // Buscar membros da equipe do gerente
          const result = await supabase
            .from('users')
            .select('id, name, apelido, cpf, role')
            .eq('ban', false)
            .eq('role', 'corretor')
            .eq('gerente', userData.apelido);
          teamMembers = result.data;
          teamError = result.error;
        } else if (userData.role === 'superintendente') {
          // Buscar todos os membros da superintendência (gerentes e corretores)
          const result = await supabase
            .from('users')
            .select('id, name, apelido, cpf, role')
            .eq('ban', false)
            .eq('role', 'corretor')
            .eq('superintendente', userData.apelido);
          teamMembers = result.data;
          teamError = result.error;
        }

        if (teamError) throw teamError;

        if (!teamMembers || teamMembers.length === 0) {
          setTeamData([]);
          setTotalVendasEquipe(0);
          return;
        }

        // Buscar total de vendas da equipe (usando lógica do useVendas)
        let totalVendasQuery = supabase
          .from('base_de_vendas')
          .select('*')
          .eq('periodo_id', period.id);

        if (userData.role === 'superintendente') {
          totalVendasQuery = totalVendasQuery.eq('superintendente', userData.apelido);
        } else if (userData.role === 'gerente') {
          totalVendasQuery = totalVendasQuery.eq('gerente', userData.apelido);
        }

        const { data: totalVendasData, error: totalVendasError } = await totalVendasQuery;

        if (totalVendasError) {
          console.error('Erro ao buscar total de vendas:', totalVendasError);
        }

        // Armazenar o total de vendas da equipe no estado
        setTotalVendasEquipe(totalVendasData?.length || 0);

        // Para cada membro da equipe, buscar suas métricas e avatar
        const teamWithMetrics = await Promise.all(
          teamMembers.map(async (member: any) => {
            // Buscar avatar do perfil
            const { data: profileData } = await supabase
              .from('profiles')
              .select('avatar_url')
              .eq('id', member.id)
              .maybeSingle();
            
            // Buscar vendas individuais do membro (sempre como vendedor_parceiro)
            const { data: vendas, error: vendasError } = await supabase
              .from('base_de_vendas')
              .select('*')
              .eq('periodo_id', period.id)
              .eq('vendedor_parceiro', member.apelido);

            if (vendasError) {
              console.error('Erro ao buscar vendas:', vendasError);
            }

            // Buscar resumo de pagamentos da tabela resume
            const { data: resumeData, error: resumeError } = await supabase
              .from('resume')
              .select('pagar, comissao, saldo_cef, distrato')
              .eq('periodo_id', period.id)
              .eq('cpf', member.cpf)
              .maybeSingle();

            if (resumeError) {
              console.error('Erro ao buscar resumo:', resumeError);
            }

            // Buscar visitas do período atual
            const { data: visitas, error: visitasError } = await supabase
              .from('visits')
              .select('id')
              .eq('corretor_id', member.id)
              .gte('horario_entrada', period.isoStart)
              .lte('horario_entrada', period.isoEnd + ' 23:59:59');

            if (visitasError) {
              console.error('Erro ao buscar visitas:', visitasError);
            }

            // Calcular métricas
            const totalVendas = vendas?.length || 0;
            const valorRecebido = vendas?.reduce((sum, venda) => sum + (venda.recebido || 0), 0) || 0;
            const totalVisitas = visitas?.length || 0;
            const contratos = vendas?.filter(venda => 
              venda.tipo_venda && venda.tipo_venda.toLowerCase().includes('contrato')
            ).length || 0;

            // Valores do resumo
            const valorAReceber = resumeData?.pagar || 0;
            const comissao = resumeData?.comissao || 0;
            const saldoCef = resumeData?.saldo_cef || 0;
            const distrato = resumeData?.distrato || 0;
            const valorNota = valorAReceber + comissao + saldoCef + (distrato || 0);
            const premio = 0;

            return {
              id: member.id,
              name: member.name,
              apelido: member.apelido,
              cpf: member.cpf,
              role: member.role,
              avatar_url: profileData?.avatar_url,
              vendas: totalVendas,
              valorRecebido,
              visitas: totalVisitas,
              contratos,
              valorAReceber,
              comissao,
              premio,
              saldoCef,
              distrato,
              valorNota,
            };
          })
        );

        setTeamData(teamWithMetrics);
      } catch (err) {
        console.error('Erro ao buscar dados da equipe:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [userData, period]);

  const teamStats = {
    totalMembros: teamData.length,
    totalVendas: totalVendasEquipe,
    totalVisitas: teamData.reduce((sum, member) => sum + member.visitas, 0),
    totalContratos: teamData.reduce((sum, member) => sum + member.contratos, 0),
  };

  return {
    teamData,
    teamStats,
    loading,
    error,
    isManager: userData?.role === 'gerente',
    isSuperintendente: userData?.role === 'superintendente',
  };
};