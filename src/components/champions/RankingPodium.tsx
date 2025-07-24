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
export const RankingPodium: React.FC<RankingPodiumProps> = ({
  topThree
}) => {
  if (topThree.length === 0) {
    return <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum dado encontrado</p>
      </div>;
  }
  return <div className="mb-8">
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
        return <Card key={person.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${getCardSize(position)} ${position === 1 ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-white' : ''}`}>
              <CardContent className="p-6 text-center">
                {/* Rank Icon */}
                <div className="flex justify-center mb-4">
                  {getRankIcon(position)}
                </div>

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={person.avatar_url} alt={person.apelido} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                      {person.apelido.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Name */}
                <h3 className="font-bold text-lg mb-1">{person.apelido}</h3>
                <p className="text-sm text-muted-foreground mb-4">{person.name}</p>

                {/* Stats */}
                <div className="space-y-3 text-left">
                  <div className="text-left">
                    <p className="text-2xl font-bold text-primary">{person.vendas}</p>
                    <p className="text-sm text-muted-foreground">Vendas</p>
                  </div>
                  
                  <div>
                    <p className="text-lg font-semibold text-accent">
                      {formatRecebimento(person.recebimento)}
                    </p>
                    <p className="text-sm text-muted-foreground">Recebimento</p>
                  </div>

                  {/* Badges */}
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {person.visitas}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <FileText className="w-3 h-3 mr-1" />
                      {person.contratos}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>;
      })}
      </div>
    </div>;
};