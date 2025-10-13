import { useState } from 'react';
import { AgendamentoStats } from '@/components/agendamentos/AgendamentoStats';
import { AgendamentoFilters } from '@/components/agendamentos/AgendamentoFilters';
import { AgendamentoCard } from '@/components/agendamentos/AgendamentoCard';
import { useAgendamentos, AgendamentoStatus } from '@/hooks/useAgendamentos';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';

export default function Agendamentos() {
  const [selectedStatus, setSelectedStatus] = useState<AgendamentoStatus | 'todos'>('todos');
  const [selectedPeriodo, setSelectedPeriodo] = useState<'hoje' | '7dias' | '30dias' | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: agendamentos, isLoading } = useAgendamentos({
    status: selectedStatus === 'todos' ? undefined : selectedStatus,
    periodo: selectedPeriodo === 'todos' ? undefined : selectedPeriodo,
    search: searchQuery,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus agendamentos de visitas
        </p>
      </div>

      <AgendamentoStats />

      <AgendamentoFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPeriodo={selectedPeriodo}
        onPeriodoChange={setSelectedPeriodo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : agendamentos && agendamentos.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agendamentos.map((agendamento) => (
            <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum agendamento encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchQuery
              ? 'Tente ajustar os filtros de busca'
              : 'Você ainda não possui agendamentos cadastrados'}
          </p>
        </div>
      )}
    </div>
  );
}
