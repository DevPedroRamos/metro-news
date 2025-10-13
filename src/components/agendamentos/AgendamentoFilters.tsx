import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AgendamentoStatus } from '@/hooks/useAgendamentos';

interface AgendamentoFiltersProps {
  selectedStatus: AgendamentoStatus | 'todos';
  onStatusChange: (status: AgendamentoStatus | 'todos') => void;
  selectedPeriodo: 'hoje' | '7dias' | '30dias' | 'todos';
  onPeriodoChange: (periodo: 'hoje' | '7dias' | '30dias' | 'todos') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function AgendamentoFilters({
  selectedStatus,
  onStatusChange,
  selectedPeriodo,
  onPeriodoChange,
  searchQuery,
  onSearchChange,
}: AgendamentoFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, empreendimento ou loja..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={selectedStatus} onValueChange={(v) => onStatusChange(v as any)} className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pendente">Pendentes</TabsTrigger>
            <TabsTrigger value="confirmado">Confirmados</TabsTrigger>
            <TabsTrigger value="check_in">Check-in</TabsTrigger>
            <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
          </TabsList>
        </Tabs>

        <Tabs value={selectedPeriodo} onValueChange={(v) => onPeriodoChange(v as any)} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="7dias">7 dias</TabsTrigger>
            <TabsTrigger value="30dias">30 dias</TabsTrigger>
            <TabsTrigger value="todos">Todos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
