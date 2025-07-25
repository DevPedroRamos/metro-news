import React from 'react';
import { Clock, MapPin, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActiveVisit {
  id: string;
  cliente_nome: string;
  cliente_cpf: string;
  mesa: number;
  loja: string;
  andar: string;
  empreendimento?: string;
  horario_entrada: string;
}

interface ActiveVisitsPopoverProps {
  visits: ActiveVisit[];
  loading: boolean;
  onFinalizeVisit: (visitId: string) => void;
}

export function ActiveVisitsPopover({ visits, loading, onFinalizeVisit }: ActiveVisitsPopoverProps) {
  if (loading) {
    return (
      <div className="w-80 p-4">
        <div className="space-y-3">
          <div className="h-4 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="w-80 p-4 text-center">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="font-medium text-foreground mb-2">Nenhuma visita ativa</h3>
        <p className="text-sm text-muted-foreground">
          Não há visitas em andamento no momento.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Visitas Ativas ({visits.length})
        </h3>
      </div>
      
      <div className="p-3 space-y-3">
        {visits.map((visit, index) => (
          <Card key={visit.id} className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {visit.cliente_nome}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Mesa {visit.mesa}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {visit.loja} - {visit.andar}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(visit.horario_entrada), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </div>
              
              {visit.empreendimento && (
                <div className="text-xs text-muted-foreground">
                  <strong>Empreendimento:</strong> {visit.empreendimento}
                </div>
              )}
              
              <Button
                size="sm"
                onClick={() => onFinalizeVisit(visit.id)}
                className="w-full mt-3"
                variant="destructive"
              >
                Finalizar Visita
              </Button>
            </CardContent>
            
            {index < visits.length - 1 && <Separator className="my-0" />}
          </Card>
        ))}
      </div>
    </div>
  );
}