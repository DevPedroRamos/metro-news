"use client"

import { useState } from "react"
import { FeaturedNews } from "@/components/news/FeaturedNews"
import { NewsCard } from "@/components/news/NewsCard"
import { NewsListItem } from "@/components/news/NewsListItem"
import { CategoryFilter } from "@/components/news/CategoryFilter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Tag, Newspaper } from "lucide-react"
import { useNews, useFilteredNews } from "@/hooks/useNews"
import { useNewsCategories } from "@/hooks/useNewsCategories"
import { LoadingSpinner, ErrorState, EmptyState, PageHeader, SectionHeader } from "@/shared/components"

const Noticias = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { featuredNews, latestNews, mostReadNews, loading: newsLoading, error: newsError } = useNews()
  const { filteredNews, loading: filteredLoading } = useFilteredNews(selectedCategory)
  const { categories, loading: categoriesLoading } = useNewsCategories()

  if (newsLoading || categoriesLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="lg" message="Carregando notícias..." />
      </div>
    )
  }

  if (newsError) {
    return (
      <div className="py-12 px-4">
        <ErrorState
          title="Erro ao carregar notícias"
          message={newsError}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Últimas Notícias"
        description="Fique por dentro das últimas novidades e acontecimentos mais importantes do momento"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3 space-y-12">
            {featuredNews && (
              <section>
                <SectionHeader title="Destaque" />
                <FeaturedNews
                  id={featuredNews.id}
                  title={featuredNews.title}
                  excerpt={featuredNews.description}
                  imageUrl={featuredNews.image}
                  category={featuredNews.category}
                  author={featuredNews.author}
                  publishedAt={featuredNews.date}
                  slug={featuredNews.slug}
                />
              </section>
            )}

            <section>
              <SectionHeader title="Últimos Conteúdos" />
              {latestNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestNews.map((news, index) => (
                    <div key={news.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                      <NewsCard
                        id={news.id}
                        title={news.title}
                        excerpt={news.description}
                        imageUrl={news.image}
                        category={news.category}
                        author={news.author}
                        publishedAt={news.date}
                        slug={news.slug}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Newspaper}
                  title="Nenhuma notícia encontrada"
                  description="Ainda não há notícias publicadas. Volte mais tarde para conferir as novidades."
                />
              )}
            </section>

            <section>
              <SectionHeader title="Por Categoria" />

              <div className="mb-6">
                <CategoryFilter
                  categories={categories.map((cat) => cat.name)}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {filteredLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner message="Carregando categoria..." />
                </div>
              ) : filteredNews.length > 0 ? (
                <div className="space-y-4">
                  {filteredNews.map((news, index) => (
                    <div key={news.id} style={{ animationDelay: `${index * 30}ms` }} className="animate-fade-in">
                      <NewsListItem
                        id={news.id}
                        title={news.title}
                        excerpt={news.description}
                        imageUrl={news.image}
                        category={news.category}
                        author={news.author}
                        publishedAt={news.date}
                        slug={news.slug}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Tag}
                  title="Nenhuma notícia encontrada"
                  description={`Não há notícias na categoria "${selectedCategory}".`}
                />
              )}
            </section>
          </main>

          <aside className="lg:col-span-1 space-y-6">
            {/* Most Read Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Mais Lidos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mostReadNews.length > 0 ? (
                  mostReadNews.slice(0, 5).map((news, index) => (
                    <div key={news.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight line-clamp-2 mb-1">{news.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{news.date}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma notícia encontrada.</p>
                )}
              </CardContent>
            </Card>

            {/* Categories Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="w-5 h-5 text-primary" />
                  Categorias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategory === category.name ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Noticias
