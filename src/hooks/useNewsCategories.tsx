import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export function useNewsCategories() {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news_categories')
          .select('id, name, slug, color')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;

        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error
  };
}