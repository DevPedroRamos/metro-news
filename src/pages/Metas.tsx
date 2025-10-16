import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useMetas } from '@/hooks/useMetas';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Target } from 'lucide-react';
export default function Metas() {
  const {
    data: metas,
    isLoading,
    error
  } = useMetas();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  if (isLoading) {
    return <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-8">
          
          <h1 className="text-3xl font-bold text-gray-900">Metas</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>)}
        </div>
      </div>;
  }
  if (error) {
    return <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar metas: {error.message}</p>
        </div>
      </div>;
  }
  const featuredMetas = metas?.filter(meta => meta.is_featured) || [];
  const regularMetas = metas?.filter(meta => !meta.is_featured) || [];
  return <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-8">
        <Target className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-gray-900">Metas</h1>
      </div>

      {/* Featured Metas */}
      {featuredMetas.length > 0 && <div className="mb-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredMetas.map(meta => <Card key={meta.id} className="border-2 border-yellow-300 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{meta.title}</CardTitle>
                    
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Quantidade: {meta.quantidade}
                    </Badge>
                    <Badge variant="outline">
                      {meta.role}
                    </Badge>
                  </div>
                </CardHeader>
                {meta.image_url && <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <img src={meta.image_url} alt={meta.title} className="w-full h-48 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage(meta.image_url)} />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <img src={meta.image_url} alt={meta.title} className="w-full h-auto" />
                      </DialogContent>
                    </Dialog>
                  </CardContent>}
              </Card>)}
          </div>
        </div>}

      {/* Regular Metas */}
      {regularMetas.length > 0 && <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Todas as Metas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularMetas.map(meta => <Card key={meta.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{meta.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      Quantidade: {meta.quantidade}
                    </Badge>
                    <Badge variant="outline">
                      {meta.role}
                    </Badge>
                  </div>
                </CardHeader>
                {meta.image_url && <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <img src={meta.image_url} alt={meta.title} className="w-full h-48 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage(meta.image_url)} />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <img src={meta.image_url} alt={meta.title} className="w-full h-auto" />
                      </DialogContent>
                    </Dialog>
                  </CardContent>}
              </Card>)}
          </div>
        </div>}

      {metas?.length === 0 && <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Nenhuma meta ativa encontrada</p>
        </div>}
    </div>;
}