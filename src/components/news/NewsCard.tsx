import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface NewsCardProps {
  id: string
  title: string
  excerpt: string
  imageUrl?: string
  category: string
  author: string
  publishedAt: string
  readTime?: string
  slug?: string
  onViewArticle?: (id: string) => void
}

export function NewsCard({
  id,
  title,
  excerpt,
  imageUrl,
  category,
  author,
  publishedAt,
  readTime = "3 min",
  slug,
  onViewArticle
}: NewsCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (slug) {
      if (onViewArticle) {
        onViewArticle(id);
      }
      navigate(`/noticias/${slug}`)
    }
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
      onClick={handleClick}
      role="article"
    >
      <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={`Imagem: ${title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="text-muted-foreground" aria-hidden="true">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <Badge variant="secondary" className="w-fit">
          {category}
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="font-bold mb-2 text-balance leading-tight group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 text-pretty line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" aria-hidden="true" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <time dateTime={publishedAt}>{publishedAt}</time>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
