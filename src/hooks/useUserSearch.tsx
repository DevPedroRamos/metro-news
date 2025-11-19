import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserSearchResult {
  id: string;
  name: string;
  apelido: string;
  cpf: string;
  role: string;
}

export const useUserSearch = (searchTerm: string, currentUserApelido?: string, currentUserRole?: string) => {
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

        // Se for diretor, buscar apenas usuários da sua diretoria
        if (currentUserRole === 'diretor' && currentUserApelido) {
          // 1. Buscar superintendentes da diretoria
          const { data: superintendentes, error: superError } = await supabase
            .from('users')
            .select('apelido')
            .eq('role', 'superintendente')
            .eq('diretor', currentUserApelido);

          if (superError) throw superError;

          const superList = superintendentes?.map(s => s.apelido) || [];

          if (superList.length === 0) {
            setUsers([]);
            return;
          }

          // 2. Buscar todos os usuários dessas superintendências
          const { data, error: searchError } = await supabase
            .from('users')
            .select('id, name, apelido, cpf, role')
            .ilike('apelido', `%${searchTerm}%`)
            .in('superintendente', superList)
            .eq('ban', false)
            .limit(10);

          if (searchError) throw searchError;
          setUsers(data || []);
        } else {
          // Admin vê todos
          const { data, error: searchError } = await supabase
            .from('users')
            .select('id, name, apelido, cpf, role')
            .ilike('apelido', `%${searchTerm}%`)
            .eq('ban', false)
            .limit(10);

          if (searchError) throw searchError;
          setUsers(data || []);
        }
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, currentUserApelido, currentUserRole]);

  return { users, loading, error };
};
