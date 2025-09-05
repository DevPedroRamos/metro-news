"use client";

import type React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Users, FileText, ChevronDown, Trophy, TrendingUp, Eye, Award } from "lucide-react";
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
  loadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  rankingType: 'consultor' | 'gerente' | 'superintendente' | 'diretor';
}
export const RankingTable: React.FC<RankingTableProps> = ({
  data,
  userPosition,
  currentUserId,
  loadMore,
  hasMore,
  loadingMore,
  rankingType
}) => {
  // Exibir do 4º colocado em diante
  const tableData = data.slice(3);
  if (tableData.length === 0) {
    return <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Classificação geral não disponível</p>
          <p className="text-sm text-gray-400 mt-1">Os dados serão atualizados em breve</p>
        </div>
      </div>;
  }
  const formatRecebimento = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return formatCurrency(value).replace("R$", "").trim();
  };
  const getRankBadgeColor = (position: number) => {
    if (position <= 5) return "bg-gradient-to-r from-red-500 to-red-600 text-white";
    if (position <= 10) return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
  };
  return <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Classificação Geral</h3>
            <p className="text-sm text-red-100">Ranking a partir do 4º lugar</p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 border-b border-gray-200">
            <TableHead className="w-20 text-center font-semibold text-gray-700">
              <div className="flex items-center justify-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Rank</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Colaborador</span>
              </div>
            </TableHead>
            <TableHead className="text-center font-semibold text-gray-700">
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{rankingType === 'consultor' ? 'Vendas' : 'Menções'}</span>
              </div>
            </TableHead>
            
            <TableHead className="text-center font-semibold text-gray-700">
              <div className="flex items-center justify-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>Visitas e Pré-vendas</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((person, index) => {
          const position = index + 4; // Começar do 4º lugar
          const isCurrentUser = person.id === currentUserId;
          return <TableRow key={person.id} className={`transition-all duration-200 hover:bg-gray-50 ${isCurrentUser ? "bg-gradient-to-r from-red-50 to-red-50/50 border-l-4 border-l-red-500 shadow-sm" : "hover:shadow-sm"}`}>
                <TableCell className="text-center">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-sm ${getRankBadgeColor(position)}`}>
                    {position}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                        <AvatarImage src={person.avatar_url || "/placeholder.svg"} alt={person.apelido} />
                        <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-red-500 to-red-600 text-white">
                          {person.apelido.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isCurrentUser && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">•</span>
                        </div>}
                    </div>
                    <div>
                      <p className={`font-semibold ${isCurrentUser ? "text-red-700" : "text-gray-900"}`}>
                        {isCurrentUser ? "Você" : person.apelido}
                        {isCurrentUser && <Badge variant="secondary" className="ml-2 text-xs bg-red-100 text-red-700 border-red-200">
                            {person.apelido}
                          </Badge>}
                      </p>
                      <p className="text-sm text-gray-500 font-medium">{person.name}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className={`text-lg font-bold ${isCurrentUser ? "text-red-600" : "text-gray-900"}`}>
                      {person.vendas}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {rankingType === 'consultor' ? 'vendas' : 'menções'}
                    </span>
                  </div>
                </TableCell>

                

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant={isCurrentUser ? "default" : "secondary"} className={`text-xs font-medium ${isCurrentUser ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100"}`}>
                      <Users className="w-3 h-3 mr-1" />
                      {person.visitas}
                    </Badge>
                    
                  </div>
                </TableCell>
              </TableRow>;
        })}
        </TableBody>
      </Table>

      {/* Botão carregar mais */}
      {hasMore && <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-gray-50/50">
          <Button onClick={loadMore} disabled={loadingMore} variant="outline" className="w-full h-12 font-medium border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200 group bg-transparent">
            {loadingMore ? <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                <span>Carregando mais resultados...</span>
              </> : <>
                <ChevronDown className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" />
                <span>Carregar mais posições</span>
              </>}
          </Button>
        </div>}
    </div>;
};