import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

interface NewsListItemProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

export function NewsListItem({ title, description, image, category, date, author }: NewsListItemProps) {
  return (
    <div className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer group">
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <Badge variant="outline" className="mb-1 border-metro-orange text-metro-orange text-xs">
          {category}
        </Badge>
        <h4 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-metro-blue transition-colors">
          {title}
        </h4>
        <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
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
      </div>
    </div>
  );
}