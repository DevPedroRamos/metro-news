import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface RankingData {
  id: string;
  name: string;
  nickname: string;
  sales: number;
  revenue: number;
  visits: number;
  contracts: number;
  avatar_url?: string;
}

interface RankingTableProps {
  data: RankingData[];
  userPosition: number | null;
  currentUserId?: string;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export const RankingTable: React.FC<RankingTableProps> = ({ 
  data, 
  userPosition, 
  currentUserId,
  hasMore,
  loadingMore,
  onLoadMore
}) => {
  const formatRecebimento = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Display from 4th position onwards (since top 3 are in podium)
  const tableData = data.slice(3);

  if (tableData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum dado encontrado para exibir na tabela.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Classificação Geral</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Vendas</TableHead>
              <TableHead className="text-right">Recebimento</TableHead>
              <TableHead className="text-center">Badges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((person, index) => {
              const rank = index + 4; // Starting from 4th position
              const isCurrentUser = currentUserId === person.id;
              
              return (
                <TableRow 
                  key={person.id}
                  className={isCurrentUser ? 'bg-primary/5 border-primary/20' : ''}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm">
                      {rank}º
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={person.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {person.nickname?.charAt(0) || person.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{person.nickname}</div>
                        <div className="text-xs text-muted-foreground">{person.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {person.sales}
                  </TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {formatRecebimento(person.revenue)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-1 justify-center">
                      <Badge variant="secondary" className="text-xs">
                        {person.visits} visitas
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {person.contracts} contratos
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Carregando...
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Carregar mais
              </>
            )}
          </Button>
        </div>
      )}
      
      {userPosition && userPosition > 3 && (
        <div className="text-center text-sm text-muted-foreground">
          Sua posição: {userPosition}º lugar
        </div>
      )}
    </div>
  );
};