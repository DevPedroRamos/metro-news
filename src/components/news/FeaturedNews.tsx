import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';

interface FeaturedNewsProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

export function FeaturedNews({ title, description, image, category, date, author }: FeaturedNewsProps) {
  return (
    <Card className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
      <div className="aspect-[16/9] overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <Badge variant="secondary" className="mb-3 bg-metro-orange text-white border-0">
          {category}
        </Badge>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
          {title}
        </h2>
        <p className="text-gray-200 mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{author}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}