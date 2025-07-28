import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';
import { Trophy, Medal, Award, Users, FileText } from 'lucide-react';

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

interface RankingPodiumProps {
  topThree: RankingData[];
}

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    case 2:
      return <Medal className="w-6 h-6 text-gray-400" />;
    case 3:
      return <Award className="w-6 h-6 text-amber-600" />;
    default:
      return null;
  }
};

const getCardSize = (position: number) => {
  switch (position) {
    case 1:
      return "lg:scale-110 lg:order-2";
    case 2:
      return "lg:order-1";
    case 3:
      return "lg:order-3";
    default:
      return "";
  }
};

export const RankingPodium: React.FC<RankingPodiumProps> = ({ topThree }) => {
  if (topThree.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum dado encontrado</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {topThree.map((person, index) => {
          const position = index + 1;
          const formatRecebimento = (value: number) => {
            if (value >= 1000000) {
              return `R$ ${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `R$ ${(value / 1000).toFixed(0)}k`;
            }
            return formatCurrency(value);
          };

          return (
            <Card 
              key={person.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${getCardSize(position)} ${
                position === 1 ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-white' : ''
              }`}
            >
              <CardContent className="p-6">
                {/* Header with Avatar and Info */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar with Ranking Badge */}
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={person.avatar_url} alt={person.apelido} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                        {person.apelido.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Ranking Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-xs font-bold text-yellow-900">{position}</span>
                    </div>
                  </div>

                  {/* Name and Stats */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 truncate">{person.apelido}</h3>
                    <p className="text-sm text-muted-foreground mb-3 truncate">{person.name}</p>
                    
                    {/* Sales and Revenue */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Vendas:</span>
                        <span className="font-semibold">{person.vendas}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">💰</span>
                        <span className="font-semibold">{formatRecebimento(person.recebimento)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Badges */}
                <div className="flex justify-center gap-3">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
                    <span className="mr-1">🏆</span>
                    <span className="font-medium">{person.visitas}</span>
                    <span className="ml-1 text-xs">visitas</span>
                  </Badge>
                  <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100">
                    <span className="mr-1">📍</span>
                    <span className="font-medium">{person.contratos}</span>
                    <span className="ml-1 text-xs">pré vendas</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};