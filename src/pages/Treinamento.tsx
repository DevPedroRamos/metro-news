
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Treinamento = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Treinamento</h1>
        <p className="text-lg text-muted-foreground">
          Desenvolva suas habilidades com nossos programas de capacitação
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Centro de Treinamentos</CardTitle>
            <CardDescription>
              Aqui você encontrará todos os cursos e materiais de capacitação disponíveis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Em breve, cursos interativos e certificações estarão disponíveis nesta seção.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Treinamento;
