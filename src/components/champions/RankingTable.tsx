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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="text-center">Vendas</TableHead>
            <TableHead className="text-right">Recebimento</TableHead>
            <TableHead className="text-center">Visitas e Contratos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((person, index) => {
            const position = index + 4; // Começar do 4º lugar
            const isCurrentUser = person.id === currentUserId;
            
            return (
              <TableRow 
                key={person.id}
                className={isCurrentUser ? 'bg-blue-50 border-blue-200' : ''}
                style={isCurrentUser ? { backgroundColor: '#f1f5ff' } : {}}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                    {position}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={person.avatar_url} alt={person.apelido} />
                      <AvatarFallback className="text-sm font-semibold">
                        {person.apelido.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {isCurrentUser ? "You" : person.apelido}
                        {isCurrentUser && <span className="text-blue-600 ml-2">({person.apelido})</span>}
                      </p>
                      <p className="text-sm text-muted-foreground">{person.name}</p>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <span className={`font-semibold ${isCurrentUser ? 'font-bold text-blue-600' : ''}`}>
                    {person.vendas} Vendas
                  </span>
                </TableCell>
                
                <TableCell className="text-right">
                  <span className="font-medium text-muted-foreground">
                    💰 R$ {formatRecebimento(person.recebimento)} Recebimento
                  </span>
                </TableCell>
                
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Badge 
                      variant={isCurrentUser ? "default" : "secondary"} 
                      className={`text-xs ${isCurrentUser ? 'bg-blue-500 hover:bg-blue-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}`}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      {person.visitas} visitas
                    </Badge>
                    <Badge 
                      variant={isCurrentUser ? "default" : "outline"} 
                      className={`text-xs ${isCurrentUser ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100'}`}
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {person.contratos} contratos
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