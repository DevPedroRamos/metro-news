import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserSearchResult {
  id: string;
  name: string;
  apelido: string;
  cpf: string;
  role: string;
}

export const useUserSearch = (searchTerm: string) => {
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: searchError } = await supabase
          .from('users')
          .select('id, name, apelido, cpf, role')
          .ilike('apelido', `%${searchTerm}%`)
          .eq('ban', false)
          .limit(10);

        if (searchError) throw searchError;

        setUsers(data || []);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return { users, loading, error };
};
