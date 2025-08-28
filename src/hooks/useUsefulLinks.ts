
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UsefulLink {
  id: string;
  title: string;
  description: string;
  url: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useUsefulLinks = () => {
  return useQuery({
    queryKey: ['useful-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('useful_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data as UsefulLink[];
    },
  });
};
