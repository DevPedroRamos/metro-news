import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useProfileUsers = () => {
  const { user: authUser } = useAuth();
  const [userData, setUserData] = useState<{
    id: string;
    cpf?: string;
    apelido?: string;
    name?: string;
    role?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser?.id) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const cpf = authUser.user_metadata?.cpf;
        if (!cpf) {
          throw new Error('CPF não encontrado nos metadados do usuário');
        }

        // Busca também o apelido, nome completo e role
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('id, cpf, apelido, name, role')
          .eq('cpf', cpf)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profileData) {
          throw new Error('Perfil do usuário não encontrado na tabela users');
        }

        setUserData({
          id: profileData.id,
          cpf: profileData.cpf || undefined,
          apelido: profileData.apelido || undefined,
          name: profileData.name || undefined,
          role: profileData.role || undefined,
        });
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  return { userData, loading, error };
};
