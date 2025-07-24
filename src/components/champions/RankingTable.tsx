import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';
import { Users, FileText } from 'lucide-react';

interface RankingData {
  id: string;
  name: string;
  apelido: string;
  vendas: number;
  recebimento: number;
  visitas: number;
  contratos: number;
  avatar_url?: string;
}

interface RankingTableProps {
  data: RankingData[];
  userPosition: number | null;
  currentUserId?: string;
}

export const RankingTable: React.FC<RankingTableProps> = ({ data, userPosition, currentUserId }) => {
  // Exibir do 4º colocado em diante
  const tableData = data.slice(3);

  if (tableData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Classificação geral não disponível</p>
      </div>
    );
  }

  const formatRecebimento = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return formatCurrency(value).replace('R$', '').trim();
  };

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Classificação Geral</h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="text-center">Vendas</TableHead>
            <TableHead className="text-center">Recebimento</TableHead>
            <TableHead className="text-center">Badges</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((person, index) => {
            const position = index + 4; // Começar do 4º lugar
            const isCurrentUser = person.id === currentUserId;
            
            return (
              <TableRow 
                key={person.id}
                className={isCurrentUser ? 'bg-primary/5 border-primary/20' : ''}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                    {position}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={person.avatar_url} alt={person.apelido} />
                      <AvatarFallback className="text-xs">
                        {person.apelido.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                     <div>
                       <p className="font-medium">
                         {person.apelido}
                         {isCurrentUser && <span className="text-primary font-bold ml-1">(You)</span>}
                       </p>
                       <p className="text-xs text-muted-foreground">{person.name}</p>
                     </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="font-semibold text-lg">{person.vendas}</span>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className="font-medium">
                    R$ {formatRecebimento(person.recebimento)}
                  </span>
                </TableCell>
                
                 <TableCell className="text-center">
                   <div className="flex items-center justify-center gap-2">
                     <Badge variant={isCurrentUser ? "default" : "secondary"} className="text-xs">
                       <Users className="w-3 h-3 mr-1" />
                       {person.visitas}
                     </Badge>
                     <Badge variant={isCurrentUser ? "default" : "outline"} className="text-xs">
                       <FileText className="w-3 h-3 mr-1" />
                       {person.contratos}
                     </Badge>
                   </div>
                 </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};