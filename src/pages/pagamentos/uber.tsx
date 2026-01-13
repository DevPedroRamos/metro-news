import React, { useState } from 'react';
import { Car, MapPin, Calendar, DollarSign, Clock, CheckCircle2, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUber, UberTrip, UberFilter } from '@/hooks/useUber';
import { useCurrentPeriod } from '@/hooks/useCurrentPeriod';

const formatCurrency = (value: number | null) => {
  if (value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const truncateAddress = (address: string | null, maxLength = 40) => {
  if (!address) return '-';
  if (address.length <= maxLength) return address;
  return address.substring(0, maxLength) + '...';
};

// Stats Component
const UberStats = ({ stats, loading }: { stats: { total: number; aguardando: number; respondidos: number; valorTotal: number }; loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500/10 rounded-lg">
              <Car className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-slate-700">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aguardando</p>
              <p className="text-2xl font-bold text-amber-700">{stats.aguardando}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Respondidos</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.respondidos}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-xl font-bold text-blue-700">{formatCurrency(stats.valorTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Card Component
const UberCard = ({ trip, onClick }: { trip: UberTrip; onClick: () => void }) => {
  const isAnswered = !!trip.venda_info;
  const isSale = trip.venda_info && trip.venda_info !== 'não';

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
      style={{ 
        borderLeftColor: isAnswered 
          ? (isSale ? 'hsl(var(--chart-2))' : 'hsl(142.1 76.2% 36.3%)') 
          : 'hsl(var(--chart-4))' 
      }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Rota */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium">{truncateAddress(trip.endereco_partida)}</span>
              <span className="text-muted-foreground mx-2">→</span>
              <span className="font-medium">{truncateAddress(trip.endereco_destino)}</span>
            </div>
          </div>

          {/* Data e Valor */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(trip.data_transacao)}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-foreground">{formatCurrency(trip.valor)}</span>
              </div>
            </div>
          </div>

          {/* Convidado */}
          {(trip.nome_convidado || trip.sobrenome_convidado) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>
                {[trip.nome_convidado, trip.sobrenome_convidado].filter(Boolean).join(' ')}
              </span>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between">
            {isAnswered ? (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {isSale ? `Venda #${trip.venda_info}` : 'Não é venda'}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="h-3 w-3 mr-1" />
                Aguardando resposta
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Detail Dialog Component
const UberDetailDialog = ({ 
  trip, 
  open, 
  onOpenChange,
  onSave,
  updating
}: { 
  trip: UberTrip | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onSave: (tripId: string, vendaInfo: string) => Promise<boolean>;
  updating: boolean;
}) => {
  const [isVenda, setIsVenda] = useState<'sim' | 'nao'>('nao');
  const [processoNumero, setProcessoNumero] = useState('');

  React.useEffect(() => {
    if (trip) {
      if (trip.venda_info) {
        if (trip.venda_info === 'não') {
          setIsVenda('nao');
          setProcessoNumero('');
        } else {
          setIsVenda('sim');
          setProcessoNumero(trip.venda_info);
        }
      } else {
        setIsVenda('nao');
        setProcessoNumero('');
      }
    }
  }, [trip]);

  const handleSave = async () => {
    if (!trip) return;
    
    const vendaInfo = isVenda === 'sim' ? processoNumero : 'não';
    
    if (isVenda === 'sim' && !processoNumero.trim()) {
      return;
    }

    const success = await onSave(trip.id, vendaInfo);
    if (success) {
      onOpenChange(false);
    }
  };

  if (!trip) return null;

  const isAnswered = !!trip.venda_info;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Detalhes da Corrida
          </DialogTitle>
          <DialogDescription>
            Visualize os detalhes e informe se esta corrida foi para uma venda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Data e Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Data</Label>
              <p className="font-medium">{formatDate(trip.data_transacao)}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Valor</Label>
              <p className="font-medium text-lg">{formatCurrency(trip.valor)}</p>
            </div>
          </div>

          {/* Trip ID */}
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Trip ID</Label>
            <p className="font-mono text-sm bg-muted p-2 rounded">{trip.trip_id}</p>
          </div>

          {/* Partida */}
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Partida
            </Label>
            <p className="text-sm">{trip.endereco_partida || '-'}</p>
          </div>

          {/* Destino */}
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Destino
            </Label>
            <p className="text-sm">{trip.endereco_destino || '-'}</p>
          </div>

          {/* Convidado */}
          {(trip.nome_convidado || trip.sobrenome_convidado) && (
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs flex items-center gap-1">
                <User className="h-3 w-3" /> Convidado
              </Label>
              <p className="text-sm font-medium">
                {[trip.nome_convidado, trip.sobrenome_convidado].filter(Boolean).join(' ')}
              </p>
            </div>
          )}

          {/* Código de Despesa */}
          {trip.codigo_despesa && (
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Código de Despesa</Label>
              <p className="text-sm">{trip.codigo_despesa}</p>
            </div>
          )}

          {/* Separator */}
          <div className="border-t pt-4">
            <Label className="font-medium">Esta corrida foi para uma venda?</Label>
            
            <RadioGroup 
              value={isVenda} 
              onValueChange={(value) => setIsVenda(value as 'sim' | 'nao')}
              className="mt-3"
              disabled={isAnswered}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim" className="cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="nao" />
                <Label htmlFor="nao" className="cursor-pointer">Não</Label>
              </div>
            </RadioGroup>

            {isVenda === 'sim' && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="processo">Número do processo da venda</Label>
                <Input
                  id="processo"
                  placeholder="Digite o número do processo"
                  value={processoNumero}
                  onChange={(e) => setProcessoNumero(e.target.value)}
                  disabled={isAnswered}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isAnswered ? 'Fechar' : 'Cancelar'}
          </Button>
          {!isAnswered && (
            <Button 
              onClick={handleSave} 
              disabled={updating || (isVenda === 'sim' && !processoNumero.trim())}
            >
              {updating ? 'Salvando...' : 'Salvar Resposta'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Page Component
export default function Uber() {
  const { trips, stats, loading, error, filter, setFilter, updating, updateVendaInfo } = useUber();
  const { period, loading: periodLoading } = useCurrentPeriod();
  const [selectedTrip, setSelectedTrip] = useState<UberTrip | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCardClick = (trip: UberTrip) => {
    setSelectedTrip(trip);
    setDialogOpen(true);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-destructive">Erro ao carregar dados: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Car className="h-6 w-6" />
          Uber Corporativo
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestão de corridas e vinculação com vendas
          {period && (
            <span className="ml-2 text-sm">
              • Período: {period.start} a {period.end}
            </span>
          )}
        </p>
      </div>

      {/* Stats */}
      <UberStats stats={stats} loading={loading || periodLoading} />

      {/* Filters */}
      <div className="mb-6">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as UberFilter)}>
          <TabsList>
            <TabsTrigger value="todos">
              Todos ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="aguardando">
              Aguardando ({stats.aguardando})
            </TabsTrigger>
            <TabsTrigger value="respondidos">
              Respondidos ({stats.respondidos})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Cards Grid */}
      {loading || periodLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {filter === 'todos' 
              ? 'Nenhuma corrida encontrada para este período.'
              : filter === 'aguardando'
              ? 'Nenhuma corrida aguardando resposta.'
              : 'Nenhuma corrida respondida ainda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.map((trip) => (
            <UberCard key={trip.id} trip={trip} onClick={() => handleCardClick(trip)} />
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <UberDetailDialog
        trip={selectedTrip}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={updateVendaInfo}
        updating={updating}
      />
    </div>
  );
}
