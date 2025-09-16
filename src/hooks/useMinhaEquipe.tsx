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
}

export const useMinhaEquipe = () => {
  const { userData } = useProfileUsers();
  const { period } = useCurrentPeriod();
  const [teamData, setTeamData] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userData?.apelido || userData.role !== 'gerente' || !period) return;

    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar membros da equipe do gerente
        const { data: teamMembers, error: teamError } = await supabase
          .from('users')
          .select(`
            id,
            name,
            apelido,
            cpf,
            role,
            profiles!inner(avatar_url)
          `)
          .eq('gerente', userData.apelido);

        if (teamError) throw teamError;

        if (!teamMembers || teamMembers.length === 0) {
          setTeamData([]);
          return;
        }

        // Para cada membro da equipe, buscar suas métricas
        const teamWithMetrics = await Promise.all(
          teamMembers.map(async (member: any) => {
            // Buscar vendas do período
            const { data: vendas, error: vendasError } = await supabase
              .from('base_de_vendas')
              .select('recebido, tipo_venda')
              .eq('periodo_id', period.id)
              .eq('vendedor_parceiro', member.name);

            if (vendasError) {
              console.error('Erro ao buscar vendas:', vendasError);
            }

            // Buscar visitas do período
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

            return {
              id: member.id,
              name: member.name,
              apelido: member.apelido,
              cpf: member.cpf,
              role: member.role,
              avatar_url: member.profiles?.avatar_url,
              vendas: totalVendas,
              valorRecebido,
              visitas: totalVisitas,
              contratos,
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
    totalValorRecebido: teamData.reduce((sum, member) => sum + member.valorRecebido, 0),
    totalVisitas: teamData.reduce((sum, member) => sum + member.visitas, 0),
    totalContratos: teamData.reduce((sum, member) => sum + member.contratos, 0),
  };

  return {
    teamData,
    teamStats,
    loading,
    error,
    isManager: userData?.role === 'gerente',
  };
};