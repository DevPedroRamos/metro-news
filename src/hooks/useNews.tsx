import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  author: string;
  slug: string;
  is_featured?: boolean;
  view_count?: number;
}

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('news_articles')
          .select(`
            id,
            title,
            slug,
            description,
            featured_image_url,
            author_name,
            published_at,
            is_featured,
            view_count,
            news_categories (
              name,
              color
            )
          `)
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;

        const formattedArticles: NewsArticle[] = (data || []).map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          description: article.description,
          image: article.featured_image_url || '/src/assets/default-cover.jpg',
          category: (article.news_categories as any)?.name || 'Geral',
          date: new Date(article.published_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          author: article.author_name,
          is_featured: article.is_featured,
          view_count: article.view_count
        }));

        setArticles(formattedArticles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar notícias');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  const featuredNews = articles.find(article => article.is_featured);
  const latestNews = articles.filter(article => !article.is_featured).slice(0, 3);
  const mostReadNews = articles
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 3);

  return {
    articles,
    featuredNews,
    latestNews,
    mostReadNews,
    loading,
    error
  };
}

export function useFilteredNews(selectedCategory: string) {
  const { articles, loading, error } = useNews();
  
  const filteredNews = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return {
    filteredNews,
    loading,
    error
  };
}