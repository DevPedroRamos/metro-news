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
      <h2 className="text-2xl font-bold text-center mb-6">🏆 Pódio dos Campeões</h2>
      
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
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${getCardSize(position)}`}
            >
              <CardContent className="p-6 text-center">
                {/* Avatar com Badge de Posição */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={person.avatar_url} alt={person.apelido} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                        {person.apelido.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Badge de posição no ranking */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 text-yellow-900 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                      {position}
                    </div>
                  </div>
                </div>

                {/* Nome do corretor */}
                <h3 className="font-bold text-lg text-foreground mb-4">{person.apelido}</h3>

                {/* Vendas e Recebimento lado a lado */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xl font-bold text-primary">{person.vendas}</p>
                    <p className="text-sm text-muted-foreground">Vendas</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">
                      {formatRecebimento(person.recebimento)}
                    </p>
                    <p className="text-sm text-muted-foreground">💰 Recebimento</p>
                  </div>
                </div>

                {/* Badges na parte inferior */}
                <div className="flex justify-center gap-3">
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                    <Trophy className="w-3 h-3 mr-1" />
                    {person.visitas} Visitas
                  </Badge>
                  <Badge className="bg-pink-100 text-red-600 hover:bg-pink-100 border-pink-200">
                    <FileText className="w-3 h-3 mr-1" />
                    {person.contratos} Contratos
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