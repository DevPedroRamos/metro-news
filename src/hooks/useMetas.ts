import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Meta {
  id: string;
  title: string;
  quantidade: number;
  role: string;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useMetas = () => {
  return useQuery({
    queryKey: ['metas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Meta[];
    },
  });
};