import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface FeaturedNewsProps {
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

export function FeaturedNews({
  id,
  title,
  excerpt,
  imageUrl,
  category,
  author,
  publishedAt,
  readTime = "5 min",
  slug,
  onViewArticle
}: FeaturedNewsProps) {
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleClick}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="aspect-video md:aspect-square bg-muted flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-muted-foreground">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        <CardContent className="p-6 flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit mb-3">
            {category}
          </Badge>
          <h3 className="text-2xl font-bold mb-3 text-balance leading-tight">{title}</h3>
          <p className="text-muted-foreground mb-4 text-pretty">{excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{publishedAt}</span>
            </div>
            <span>• {readTime} de leitura</span>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
