import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileUsers } from '@/hooks/useProfileUsers';

export interface AnaliseCredito {
  id: string;
  processNumber: string;
  clientName: string;
  projectName: string;
  queueType: string;
  observation: string | null;
  status: string;
  source: string;
  linkToProcess: string;
  approvalStatus: string | null;
  approvalObservation: string | null;
  requesterName: string;
  requesterNickname: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  metadata: any | null;
}

interface AnaliseResponse {
  data: AnaliseCredito[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface TeamMember {
  apelido: string;
}

export const useAnaliseCredito = (startDate?: Date, endDate?: Date) => {
  const { userData, loading: userLoading } = useProfileUsers();
  const [data, setData] = useState<AnaliseCredito[]>([]);
  const [filteredData, setFilteredData] = useState<AnaliseCredito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  // Fetch team members based on role
  const fetchTeamMembers = useCallback(async () => {
    if (!userData?.apelido || !userData?.role) return [];

    const role = userData.role;
    const apelido = userData.apelido;

    // Admin sees all
    if (role === 'adm') {
      return null; // null means no filter
    }

    // Corretor/Parceria sees only their own
    if (role === 'corretor' || role === 'parceria') {
      return [apelido];
    }

    // For hierarchical roles, fetch team members
    let query = supabase.from('users').select('apelido').eq('ban', false);

    if (role === 'gerente') {
      query = query.eq('gerente', apelido);
    } else if (role === 'superintendente') {
      query = query.eq('superintendente', apelido);
    } else if (role === 'diretor') {
      query = query.eq('diretor', apelido);
    }

    const { data: members, error } = await query;

    if (error) {
      console.error('Error fetching team members:', error);
      return [apelido];
    }

    return members?.map((m: TeamMember) => m.apelido) || [apelido];
  }, [userData?.apelido, userData?.role]);

  // Fetch data from edge function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: responseData, error: fetchError } = await supabase.functions.invoke('analise-credito', {
        body: null,
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      const response = responseData as AnaliseResponse;
      setData(response.data || []);
    } catch (err) {
      console.error('Error fetching analise credito:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter data based on role and dates
  useEffect(() => {
    const applyFilters = async () => {
      if (userLoading || !userData) return;

      const members = await fetchTeamMembers();
      setTeamMembers(members || []);

      let filtered = [...data];

      // Apply role-based filter
      if (members !== null) {
        filtered = filtered.filter(item => 
          members.some(member => 
            item.requesterNickname?.toLowerCase() === member?.toLowerCase()
          )
        );
      }

      // Apply date filters
      if (startDate) {
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate >= startDate;
        });
      }

      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate <= endOfDay;
        });
      }

      // Sort by createdAt descending
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFilteredData(filtered);
    };

    applyFilters();
  }, [data, userData, userLoading, startDate, endDate, fetchTeamMembers]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Calculate stats
  const stats = {
    total: filteredData.length,
    pending: filteredData.filter(item => item.status === 'PENDING').length,
    approved: filteredData.filter(item => item.status === 'APPROVED').length,
    rejected: filteredData.filter(item => item.status === 'REJECTED').length,
    inProgress: filteredData.filter(item => item.status === 'IN_PROGRESS').length,
    completed: filteredData.filter(item => item.status === 'COMPLETED').length,
  };

  return {
    data: filteredData,
    loading: loading || userLoading,
    error,
    refresh,
    stats,
  };
};
