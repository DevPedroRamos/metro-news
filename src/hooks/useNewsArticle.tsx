import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsArticleDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featured_image_url: string | null;
  category: string;
  category_id: string;
  date: string;
  author: string;
  reading_time: number;
  view_count: number;
  tags: string[] | null;
  is_featured: boolean;
}

export interface RelatedArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  author: string;
  slug: string;
}

export function useNewsArticle(slug: string) {
  const [article, setArticle] = useState<NewsArticleDetail | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch the main article
        const { data: articleData, error: articleError } = await supabase
          .from('news_articles')
          .select(`
            id,
            title,
            slug,
            description,
            content,
            featured_image_url,
            author_name,
            published_at,
            reading_time_minutes,
            view_count,
            tags,
            is_featured,
            category_id,
            news_categories (
              name,
              color
            )
          `)
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (articleError) throw articleError;
        if (!articleData) throw new Error('Artigo não encontrado');

        const formattedArticle: NewsArticleDetail = {
          id: articleData.id,
          title: articleData.title,
          slug: articleData.slug,
          description: articleData.description,
          content: articleData.content,
          featured_image_url: articleData.featured_image_url,
          category: (articleData.news_categories as any)?.name || 'Geral',
          category_id: articleData.category_id,
          date: new Date(articleData.published_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }),
          author: articleData.author_name,
          reading_time: articleData.reading_time_minutes || 5,
          view_count: articleData.view_count || 0,
          tags: articleData.tags,
          is_featured: articleData.is_featured
        };

        setArticle(formattedArticle);

        // Fetch related articles (same category, excluding current article)
        const { data: relatedData, error: relatedError } = await supabase
          .from('news_articles')
          .select(`
            id,
            title,
            slug,
            description,
            featured_image_url,
            author_name,
            published_at,
            news_categories (
              name
            )
          `)
          .eq('category_id', articleData.category_id)
          .eq('is_published', true)
          .neq('id', articleData.id)
          .order('published_at', { ascending: false })
          .limit(3);

        if (relatedError) throw relatedError;

        const formattedRelated: RelatedArticle[] = (relatedData || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.featured_image_url || '/src/assets/default-cover.jpg',
          category: (item.news_categories as any)?.name || 'Geral',
          date: new Date(item.published_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          author: item.author_name,
          slug: item.slug
        }));

        setRelatedArticles(formattedRelated);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar artigo');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);

  const incrementViewCount = useCallback(async () => {
    if (!article) return;

    try {
      await supabase
        .from('news_articles')
        .update({ view_count: (article.view_count || 0) + 1 })
        .eq('id', article.id);
      
      // Update local state
      setArticle(prev => prev ? { ...prev, view_count: prev.view_count + 1 } : null);
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  }, [article]);

  return {
    article,
    relatedArticles,
    loading,
    error,
    incrementViewCount
  };
}