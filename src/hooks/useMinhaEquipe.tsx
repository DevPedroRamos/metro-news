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

export const useMinhaEquipe = (viewAsAdmin = false) => {
  const { userData, loading: userLoading, error: userError } = useProfileUsers();
  const { period, loading: periodLoading, error: periodError } = useCurrentPeriod();

  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isManager = userData?.role === 'gerente';
  const isSuperintendente = userData?.role === 'superintendente';
  const isDiretor = userData?.role === 'diretor';
  const isAdmin = viewAsAdmin;

  useEffect(() => {
    const fetchTeamData = async () => {
      if (userLoading || periodLoading || !userData || !period?.id) return;
      if (!isManager && !isSuperintendente && !isDiretor && !isAdmin) {
        setError('Acesso negado. Apenas gerentes, superintendentes, diretores e administradores podem visualizar esta página.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Buscar membros da equipe
        let teamQuery = supabase
          .from('users')
          .select('id, name, apelido, cpf, role')
          .eq('ban', false);

      if (isAdmin) {
        // Admin vê TODOS: corretores, parcerias, gerentes E superintendentes
        teamQuery = teamQuery.in('role', ['corretor', 'parceria', 'gerente', 'superintendente']);
      } else if (isDiretor) {
        // Diretor vê todos onde diretor = seu apelido
        teamQuery = teamQuery
          .in('role', ['corretor', 'parceria', 'gerente', 'superintendente'])
          .eq('diretor', userData.apelido);
      } else if (isSuperintendente) {
        teamQuery = teamQuery
          .in('role', ['corretor', 'parceria'])
          .eq('superintendente', userData.apelido);
      } else if (isManager) {
        teamQuery = teamQuery
          .in('role', ['corretor', 'parceria'])
          .eq('gerente', userData.apelido);
      }

        const { data: teamMembers, error: teamError } = await teamQuery;

        if (teamError) throw teamError;

        if (!teamMembers || teamMembers.length === 0) {
          setTeamData([]);
          setLoading(false);
          return;
        }

        // Buscar total de vendas da equipe
        let totalVendasQuery = supabase
          .from('base_de_vendas')
          .select('*')
          .eq('periodo_id', period.id);

        if (!isAdmin) {
          if (isDiretor) {
            totalVendasQuery = totalVendasQuery.eq('diretor', userData.apelido);
          } else if (isSuperintendente) {
            totalVendasQuery = totalVendasQuery.eq('superintendente', userData.apelido);
          } else if (isManager) {
            totalVendasQuery = totalVendasQuery.eq('gerente', userData.apelido);
          }
        }

        const { data: totalVendasData, error: totalVendasError } = await totalVendasQuery;

        if (totalVendasError) {
          console.error('Erro ao buscar total de vendas:', totalVendasError);
        }

        const totalVendas = totalVendasData?.length || 0;

        // Para cada membro da equipe, buscar suas métricas e avatar
        const teamWithMetrics = await Promise.all(
          teamMembers.map(async (member) => {
            // Buscar avatar do perfil
            const { data: profileData } = await supabase
              .from('profiles')
              .select('avatar_url')
              .eq('id', member.id)
              .maybeSingle();
            
            // Buscar vendas individuais do membro (sempre como vendedor_parceiro)
            let vendasQuery = supabase
              .from('base_de_vendas')
              .select('*')
              .eq('periodo_id', period.id)
              .eq('vendedor_parceiro', member.apelido);

            // Aplicar filtro adicional baseado no papel do usuário logado
            if (!isAdmin) {
              if (isDiretor) {
                vendasQuery = vendasQuery.eq('diretor', userData.apelido);
              } else if (isSuperintendente) {
                vendasQuery = vendasQuery.eq('superintendente', userData.apelido);
              } else if (isManager) {
                vendasQuery = vendasQuery.eq('gerente', userData.apelido);
              }
            }

            const { data: vendas, error: vendasError } = await vendasQuery;

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
    totalVendas: teamData.reduce((sum, member) => sum + member.vendas, 0),
    totalVisitas: teamData.reduce((sum, member) => sum + member.visitas, 0),
    totalContratos: teamData.reduce((sum, member) => sum + member.contratos, 0),
  };

  return {
    teamData,
    teamStats,
    loading,
    error,
    isManager,
    isSuperintendente,
    isDiretor,
    isAdmin
  };
};