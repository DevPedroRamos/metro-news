import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, Clock, Eye } from 'lucide-react';
import { useNewsArticle } from '@/hooks/useNewsArticle';
import { NewsListItem } from '@/components/news/NewsListItem';
import { Loader2 } from 'lucide-react';
const NoticiaDetalhes = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const navigate = useNavigate();
  const {
    article,
    relatedArticles,
    loading,
    error,
    incrementViewCount
  } = useNewsArticle(slug || '');
  React.useEffect(() => {
    if (article && slug) {
      incrementViewCount();
    }
  }, [article, slug, incrementViewCount]);
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando artigo...</span>
      </div>;
  }
  if (error || !article) {
    return <div className="text-center py-12">
        <p className="text-destructive mb-4">
          {error || 'Artigo não encontrado'}
        </p>
        <Button onClick={() => navigate('/noticias')} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para notícias
        </Button>
      </div>;
  }
  return <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/noticias')} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div>

      <article className="space-y-6">
        {/* Article Header */}
        <header className="space-y-4">
          <Badge variant="outline" className="border-metro-blue text-metro-blue">
            {article.category}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.description}
          </p>
          
          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
            
            
          </div>
        </header>

        <Separator />

        {/* Featured Image */}
        {article.featured_image_url && <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
            <img src={article.featured_image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-metro-blue prose-blockquote:border-l-metro-blue prose-code:text-metro-orange" dangerouslySetInnerHTML={{
        __html: article.content
      }} />

        {/* Article Tags */}
        {article.tags && article.tags.length > 0 && <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>)}
            </div>
          </div>}
      </article>

      <Separator />

      {/* Related Articles */}
      {relatedArticles.length > 0 && <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Artigos Relacionados</h2>
          <div className="grid gap-4">
            {relatedArticles.map(relatedArticle => <Card key={relatedArticle.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/noticias/${relatedArticle.slug}`)}>
                <CardContent className="p-0">
                  <NewsListItem {...relatedArticle} />
                </CardContent>
              </Card>)}
          </div>
        </section>}
    </div>;
};
export default NoticiaDetalhes;