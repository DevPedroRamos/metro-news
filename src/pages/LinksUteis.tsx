
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useUsefulLinks } from '@/hooks/useUsefulLinks';

const LinksUteis = () => {
  const { data: links, isLoading, error } = useUsefulLinks();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Links Úteis</h1>
          <p className="text-lg text-muted-foreground">
            Acesso rápido às ferramentas e recursos importantes
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Links Úteis</h1>
          <p className="text-lg text-muted-foreground">
            Acesso rápido às ferramentas e recursos importantes
          </p>
        </div>
        <Card className="p-6">
          <p className="text-destructive">Erro ao carregar os links. Tente novamente mais tarde.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Links Úteis</h1>
        <p className="text-lg text-muted-foreground">
          Acesso rápido às ferramentas e recursos importantes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {links?.map((link) => (
          <Card key={link.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-lg">{link.title}</CardTitle>
              <CardDescription className="text-sm line-clamp-3">
                {link.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                asChild 
                className="w-full"
                variant="default"
              >
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Acessar
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {links && links.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Nenhum link disponível no momento.</p>
        </Card>
      )}
    </div>
  );
};

export default LinksUteis;
