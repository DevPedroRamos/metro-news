import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, FileText, Calendar, Building } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCommissionsData } from '@/hooks/useCommissionsData';

const CommissionsTableSkeleton = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Comissões Recebidas</h3>
            <p className="text-sm text-red-100">Histórico de comissões por venda</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
    
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export const CommissionsTable: React.FC = () => {
  const { data, totalToReceive, loading, error, refetch } = useCommissionsData();

  if (loading) {
    return <CommissionsTableSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-destructive font-medium">Erro ao carregar comissões</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Tabela de Comissões */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Comissões Recebidas</h3>
              <p className="text-sm text-red-100">Histórico de comissões por venda</p>
            </div>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Nenhuma comissão encontrada</p>
            <p className="text-sm text-gray-400 mt-1">Suas comissões aparecerão aqui quando disponíveis</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>Unidade</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Data da Venda</span>
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>Empreendimento</span>
                  </div>
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-700">
                  <div className="flex items-center justify-end space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Valor da Comissão</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((commission, index) => (
                <TableRow 
                  key={index}
                  className="transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                >
                  <TableCell className="font-medium">{commission.unidade}</TableCell>
                  <TableCell>{formatDate(commission.venda_data)}</TableCell>
                  <TableCell>{commission.empreendimento}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(commission.total_corretor)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Total a Receber */}
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Total a Receber</p>
                <p className="text-xs text-green-600">Soma de todas as comissões</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(totalToReceive)}
              </p>
              <p className="text-sm text-green-600">
                {data.length} {data.length === 1 ? 'comissão' : 'comissões'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};