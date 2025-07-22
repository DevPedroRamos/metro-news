
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Processos = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Processos</h1>
        <p className="text-lg text-muted-foreground">
          Documentação e procedimentos operacionais
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Central de Processos</CardTitle>
            <CardDescription>
              Acesse todos os procedimentos e documentos organizacionais da empresa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta seção conterá todos os manuais, fluxos e documentos importantes para o seu trabalho.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Processos;
