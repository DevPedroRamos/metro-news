
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Campeoes = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Campeões</h1>
        <p className="text-lg text-muted-foreground">
          Reconhecimento aos nossos melhores colaboradores
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hall da Fama</CardTitle>
            <CardDescription>
              Conheça os destaques e campeões de performance da nossa equipe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Rankings mensais e reconhecimentos especiais aos nossos colaboradores de destaque.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Campeoes;
