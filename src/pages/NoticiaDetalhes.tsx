"use client"

import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, User, Clock, Eye, Share2, Bookmark, ChevronRight, Home } from "lucide-react"
import { useNewsArticle } from "@/hooks/useNewsArticle"
import { Loader2 } from "lucide-react"

const NoticiaDetalhes = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { article, relatedArticles, loading, error, incrementViewCount } = useNewsArticle(slug || "")

  React.useEffect(() => {
    if (article && slug) {
      incrementViewCount()
    }
  }, [article, slug, incrementViewCount])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Carregando artigo...</span>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error || "Artigo não encontrado"}</p>
        <Button onClick={() => navigate("/noticias")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para notícias
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <main className="lg:col-span-3">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              <header className="p-8 pb-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/noticias")}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                </div>

                <Badge variant="outline" className="border-blue-500 text-blue-600 mb-4">
                  {article.category}
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">{article.title}</h1>

                <p className="text-xl text-muted-foreground leading-relaxed mb-6">{article.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                 
                  </div>

                </div>
              </header>

              {article.featured_image_url && (
                <div className="px-8 mb-8">
                  <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
                    <img
                      src={article.featured_image_url || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="px-8 pb-8">
                <div
                  className="prose text-xl prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-blue-600 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-code:text-blue-600 prose-ul:text-foreground prose-li:text-foreground"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs hover:bg-blue-100 cursor-pointer transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {relatedArticles.length > 0 && (
              <section className="mt-8">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    Artigos Relacionados
                    <div className="h-1 w-12 bg-blue-500 rounded"></div>
                  </h2>
                  <div className="grid gap-6">
                    {relatedArticles.map((relatedArticle) => (
                      <Card
                        key={relatedArticle.id}
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => navigate(`/noticias/${relatedArticle.slug}`)}
                      >
                        {/* <CardContent className="p-0">
                          <NewsListItem {...relatedArticle} />
                        </CardContent> */}
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default NoticiaDetalhes
