
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Noticias = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Notícias</h1>
        <p className="text-lg text-muted-foreground">
          Fique por dentro das últimas novidades da Metro News
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo à seção de Notícias</CardTitle>
            <CardDescription>
              Em breve, você encontrará aqui todas as notícias e atualizações importantes da empresa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta seção está sendo desenvolvida para trazer as melhores informações para você.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Noticias;
