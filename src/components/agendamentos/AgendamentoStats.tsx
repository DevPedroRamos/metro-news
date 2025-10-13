import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAgendamentosStats } from '@/hooks/useAgendamentos';
import { Skeleton } from '@/components/ui/skeleton';

export function AgendamentoStats() {
  const { data: stats, isLoading } = useAgendamentosStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total',
      value: stats?.total || 0,
      icon: Calendar,
      color: 'text-primary',
    },
    {
      title: 'Hoje',
      value: stats?.hoje || 0,
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      title: 'Confirmados',
      value: stats?.confirmados || 0,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Pendentes',
      value: stats?.pendentes || 0,
      icon: AlertCircle,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
