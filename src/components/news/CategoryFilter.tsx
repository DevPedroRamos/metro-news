"use client"

import { Badge } from "@/components/ui/badge"

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const allCategories = ["all", ...categories]

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          className="cursor-pointer hover:bg-primary/80 transition-colors capitalize"
          onClick={() => onCategoryChange(category)}
        >
          {category === "all" ? "Todas" : category}
        </Badge>
      ))}
    </div>
  )
}
