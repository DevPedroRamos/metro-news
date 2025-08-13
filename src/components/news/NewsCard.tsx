import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

export function NewsCard({ title, description, image, category, date, author }: NewsCardProps) {
  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
      <CardHeader className="p-0">
        <div className="aspect-[16/10] overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2 border-metro-blue text-metro-blue">
          {category}
        </Badge>
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-metro-blue transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{author}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}