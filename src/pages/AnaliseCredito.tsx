import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RefreshCw, ExternalLink, Calendar, FileSearch, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAnaliseCredito } from '@/hooks/useAnaliseCredito';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendente</Badge>;
    case 'APPROVED':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Aprovado</Badge>;
    case 'REJECTED':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejeitado</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Em Análise</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const AnaliseCredito = () => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  const { data, loading, error, refresh, stats } = useAnaliseCredito(startDate, endDate);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value ? new Date(value + 'T00:00:00') : undefined);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndDate(value ? new Date(value + 'T23:59:59') : undefined);
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <FileSearch className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Análise de Crédito</h1>
            <p className="text-muted-foreground text-sm">Acompanhe as solicitações de análise</p>
          </div>
        </div>
        <Button onClick={refresh} disabled={loading} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="startDate">Data Início</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="endDate">Data Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                onChange={handleEndDateChange}
              />
            </div>
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileSearch className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Aprovados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejeitados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Erro ao carregar dados: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Data List */}
      {!loading && !error && (
        <div className="space-y-4">
          {data.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma análise encontrada</p>
              </CardContent>
            </Card>
          ) : (
            data.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{item.clientName}</h3>
                        <p className="text-primary font-medium">{item.projectName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="gap-2"
                        >
                          <a href={item.linkToProcess} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Ver Processo
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Solicitante:</span> {item.requesterNickname}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>

                    {/* Observation */}
                    {item.observation && (
                      <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Observação:</span> {item.observation}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AnaliseCredito;
