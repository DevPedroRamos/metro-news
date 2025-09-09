"use client"

import { useState } from "react"
import { FeaturedNews } from "@/components/news/FeaturedNews"
import { NewsCard } from "@/components/news/NewsCard"
import { NewsListItem } from "@/components/news/NewsListItem"
import { CategoryFilter } from "@/components/news/CategoryFilter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Loader2, TrendingUp, Clock, Tag } from "lucide-react"
import { useNews, useFilteredNews } from "@/hooks/useNews"
import { useNewsCategories } from "@/hooks/useNewsCategories"

const Noticias = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { featuredNews, latestNews, mostReadNews, loading: newsLoading, error: newsError } = useNews()
  const { filteredNews, loading: filteredLoading } = useFilteredNews(selectedCategory)
  const { categories, loading: categoriesLoading } = useNewsCategories()

  if (newsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando notícias...</span>
      </div>
    )
  }

  if (newsError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erro ao carregar notícias: {newsError}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
           
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Últimas Notícias</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
              Fique por dentro das últimas novidades e acontecimentos mais importantes do momento
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            {/* Featured News */}
            {featuredNews && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-bold text-foreground">Destaque</h2>
                </div>
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

            {/* Latest Content */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-bold text-foreground">Últimos Conteúdos</h2>
                </div>
                {/* <Button variant="outline" size="sm" className="group bg-transparent">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button> */}
              </div>
              {latestNews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {latestNews.map((news) => (
                    <NewsCard 
                      key={news.id}
                      id={news.id}
                      title={news.title}
                      excerpt={news.description}
                      imageUrl={news.image}
                      category={news.category}
                      author={news.author}
                      publishedAt={news.date}
                      slug={news.slug}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Nenhuma notícia encontrada.</p>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Content by Category */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-bold text-foreground">Por Categoria</h2>
                </div>
                {/* <Button variant="outline" size="sm" className="group bg-transparent">
                  Ver categoria completa
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button> */}
              </div>

              <div className="mb-6">
                <CategoryFilter
                  categories={categories.map((cat) => cat.name)}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </div>

              {filteredLoading ? (
                <Card>
                  <CardContent className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </CardContent>
                </Card>
              ) : filteredNews.length > 0 ? (
                <div className="space-y-4">
                  {filteredNews.map((news) => (
                    <NewsListItem 
                      key={news.id}
                      id={news.id}
                      title={news.title}
                      excerpt={news.description}
                      imageUrl={news.image}
                      category={news.category}
                      author={news.author}
                      publishedAt={news.date}
                      slug={news.slug}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">Nenhuma notícia encontrada para esta categoria.</p>
                  </CardContent>
                </Card>
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
