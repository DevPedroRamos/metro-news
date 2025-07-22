
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LinksUteis = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Links Úteis</h1>
        <p className="text-lg text-muted-foreground">
          Acesso rápido às ferramentas e recursos importantes
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Central de Links</CardTitle>
            <CardDescription>
              Encontre rapidamente os recursos e ferramentas que você precisa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Links organizados por categoria para facilitar seu acesso às ferramentas de trabalho.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinksUteis;
