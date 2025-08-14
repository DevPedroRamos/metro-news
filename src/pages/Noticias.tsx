
import React, { useState } from 'react';
import { FeaturedNews } from '@/components/news/FeaturedNews';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsListItem } from '@/components/news/NewsListItem';
import { CategoryFilter } from '@/components/news/CategoryFilter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNews, useFilteredNews } from '@/hooks/useNews';
import { useNewsCategories } from '@/hooks/useNewsCategories';

const Noticias = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { featuredNews, latestNews, mostReadNews, loading: newsLoading, error: newsError } = useNews();
  const { filteredNews, loading: filteredLoading } = useFilteredNews(selectedCategory);
  const { categories, loading: categoriesLoading } = useNewsCategories();

  if (newsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando notícias...</span>
      </div>
    );
  }

  if (newsError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erro ao carregar notícias: {newsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Notícias</h1>
        <p className="text-lg text-muted-foreground">
          Fique por dentro das últimas novidades da Metro News
        </p>
      </div>

      {/* Featured News */}
      {featuredNews && (
        <section>
          <FeaturedNews {...featuredNews} />
        </section>
      )}

      {/* Latest Content */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Últimos conteúdos</h2>
          <Button variant="outline" size="sm" className="group">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        {latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((news) => (
              <NewsCard key={news.id} {...news} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Nenhuma notícia encontrada.</p>
        )}
      </section>

      {/* Content by Category */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Conteúdos por categoria</h2>
          <Button variant="outline" size="sm" className="group">
            Ver categoria completa
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <CategoryFilter 
          categories={categories.map(cat => cat.name)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        {filteredLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="space-y-4">
            {filteredNews.map((news) => (
              <NewsListItem key={news.id} {...news} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Nenhuma notícia encontrada para esta categoria.</p>
        )}
      </section>

      {/* Most Read */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Os mais lidos</h2>
          <Button variant="outline" size="sm" className="group">
            Ver todos
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        {mostReadNews.length > 0 ? (
          <div className="space-y-4">
            {mostReadNews.map((news) => (
              <NewsListItem key={news.id} {...news} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">Nenhuma notícia encontrada.</p>
        )}
      </section>
    </div>
  );
};

export default Noticias;
