
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Superintendencia = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Superintendência</h1>
        <p className="text-lg text-muted-foreground">
          Comunicados e informações da diretoria
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Central da Superintendência</CardTitle>
            <CardDescription>
              Informações estratégicas e comunicados oficiais da diretoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Acompanhe as diretrizes, metas e comunicados importantes da gestão executiva.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Superintendencia;
