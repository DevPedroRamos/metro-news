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
              className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 ${getCardSize(position)} ${
                position === 1 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 via-yellow-25 to-white shadow-yellow-200/50 shadow-xl' : 
                position === 2 ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-white shadow-gray-200/50 shadow-lg' :
                'border-amber-300 bg-gradient-to-br from-amber-50 to-white shadow-amber-200/50 shadow-lg'
              }`}
            >
              {/* Efeito de brilho para o primeiro lugar */}
              {position === 1 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200/20 to-transparent animate-pulse"></div>
              )}
              
              <CardContent className="p-6">
                {/* Header with Avatar and Info */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar with Ranking Badge */}
                  <div className="relative">
                    <Avatar className={`w-16 h-16 ring-4 ${
                      position === 1 ? 'ring-yellow-300' :
                      position === 2 ? 'ring-gray-300' :
                      'ring-amber-300'
                    }`}>
                      <AvatarImage src={person.avatar_url} alt={person.apelido} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                        {person.apelido.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Ranking Badge */}
                    <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${
                      position === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                      position === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                      'bg-gradient-to-br from-amber-500 to-amber-600'
                    }`}>
                      {getRankIcon(position)}
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
                        <span className="font-bold text-metro-red">{person.vendas}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">💰</span>
                        <span className="font-bold text-metro-green">{formatRecebimento(person.recebimento)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Badges */}
                <div className="flex justify-center gap-3">
                  <Badge className={`transition-all duration-300 hover:scale-110 ${
                    position === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-md' :
                    'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    <span className="mr-1">🏆</span>
                    <span className="font-medium">{person.visitas}</span>
                    <span className="ml-1 text-xs">visitas</span>
                  </Badge>
                  <Badge className={`transition-all duration-300 hover:scale-110 ${
                    position === 1 ? 'bg-rose-100 text-rose-700 border-rose-300 shadow-md' :
                    'bg-purple-100 text-purple-700 border-purple-200'
                  }`}>
                    <span className="mr-1">📍</span>
                    <span className="font-medium">{person.contratos}</span>
                    <span className="ml-1 text-xs">pré vendas</span>
                  </Badge>
                </div>
                
                {/* Posição destacada */}
                {position <= 3 && (
                  <div className="mt-4 text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      position === 1 ? 'bg-yellow-500 text-white' :
                      position === 2 ? 'bg-gray-500 text-white' :
                      'bg-amber-600 text-white'
                    }`}>
                      {position === 1 ? '🥇 CAMPEÃO' :
                       position === 2 ? '🥈 VICE-CAMPEÃO' :
                       '🥉 3º LUGAR'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};