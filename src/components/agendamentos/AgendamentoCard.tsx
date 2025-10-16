import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Building, Phone, Copy, ExternalLink, Briefcase } from 'lucide-react';
import { Agendamento } from '@/hooks/useAgendamentos';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
interface AgendamentoCardProps {
  agendamento: Agendamento;
  showCorretorName?: boolean;
}
export function AgendamentoCard({
  agendamento,
  showCorretorName = false
}: AgendamentoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'check_in':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'confirmado':
        return 'Confirmado';
      case 'check_in':
        return 'Check-in';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };
  const isExpired = agendamento.expires_at && isPast(new Date(agendamento.expires_at));
  const copyLink = () => {
    const link = `${window.location.origin}/confirmar/${agendamento.token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado para a área de transferência!');
  };
  const openLink = () => {
    const link = `${window.location.origin}/confirmar/${agendamento.token}`;
    window.open(link, '_blank');
  };
  return <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {agendamento.cliente_nome || 'Cliente não informado'}
            </h3>
            {showCorretorName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Briefcase className="h-3 w-3" />
                <span>{agendamento.corretor_nome}</span>
              </div>
            )}
            {agendamento.cliente_telefone && <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Phone className="h-3 w-3" />
                {agendamento.cliente_telefone}
              </div>}
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={getStatusColor(agendamento.status)}>
              {getStatusLabel(agendamento.status)}
            </Badge>
            {isExpired && agendamento.status === 'pendente' && <Badge variant="destructive" className="text-xs">
                Expirado
              </Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {agendamento.data_visita && <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(agendamento.data_visita), "dd/MM/yyyy 'às' HH:mm", {
            locale: ptBR
          })}
            </span>
          </div>}

        {agendamento.empreendimento && <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{agendamento.empreendimento}</span>
          </div>}

        {agendamento.loja && <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>
              {agendamento.loja}
              {agendamento.andar && ` - ${agendamento.andar}`}
              {agendamento.mesa && ` - Mesa ${agendamento.mesa}`}
            </span>
          </div>}

        
      </CardContent>
    </Card>;
}