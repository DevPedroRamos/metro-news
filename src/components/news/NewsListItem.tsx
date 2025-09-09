import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface NewsListItemProps {
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

export function NewsListItem({
  id,
  title,
  excerpt,
  imageUrl,
  category,
  author,
  publishedAt,
  readTime = "4 min",
  slug,
  onViewArticle
}: NewsListItemProps) {
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
    <div 
      className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-sm transition-shadow cursor-pointer group" 
      onClick={handleClick}
    >
      <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-md overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
        <h3 className="font-semibold mb-2 text-balance leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 text-pretty line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{publishedAt}</span>
          </div>
          <span>• {readTime} de leitura</span>
        </div>
      </div>
    </div>
  )
}
