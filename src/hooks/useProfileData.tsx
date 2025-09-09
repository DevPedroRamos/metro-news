import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProfileData {
  user: {
    id: string;
    name: string;
    apelido: string;
    cpf: string;
    gerente: string;
    superintendente: string;
    role: string;
    avatar_url?: string;
    cover_url?: string;
  };
  metrics: {
    vendas: number;
    recebimento: number;
    contratos: number;
    visitas: number;
  };
  ranking: {
    position: number;
    total: number;
  };
}

export const useProfileData = () => {
  const { user: authUser } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser?.id) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar função otimizada do PostgreSQL
        const { data: profileStats, error } = await supabase
          .rpc('get_profile_stats', { user_uuid: authUser.id });

        if (error) throw error;

        if (!profileStats || profileStats.length === 0) {
          throw new Error('Dados do perfil não encontrados');
        }

        const stats = profileStats[0];

        const userData = {
          id: stats.user_id,
          name: stats.user_name,
          apelido: stats.user_apelido,
          cpf: stats.user_cpf,
          gerente: stats.user_gerente,
          superintendente: stats.user_superintendente,
          role: stats.user_role,
          avatar_url: stats.avatar_url,
          cover_url: stats.cover_url
        };

        const metrics = {
          vendas: Number(stats.vendas_count) || 0,
          recebimento: Number(stats.recebimento) || 0,
          contratos: Number(stats.contratos_count) || 0,
          visitas: Number(stats.visitas_count) || 0
        };

        let ranking = {
          position: Number(stats.ranking_position) || 0,
          total: Number(stats.total_users) || 0
        };

        // Use ranking from get_profile_stats function

        setData({
          user: userData,
          metrics,
          ranking
        });

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [authUser?.id]);

  const updateProfileImages = async (field: 'avatar_url' | 'cover_url', url: string) => {
    if (!authUser?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: url })
        .eq('id', authUser.id);

      if (error) throw error;

      // Atualizar estado local
      setData(prev => prev ? {
        ...prev,
        user: { ...prev.user, [field]: url }
      } : null);

    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    updateProfileImages
  };
};