import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileUsers } from '@/hooks/useProfileUsers';

interface WeeklyPayment {
  weekStart: string;
  weekEnd: string;
  totalValue: number;
  paymentCount: number;
}

interface UsePaymentHistoryReturn {
  data: WeeklyPayment[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const usePaymentHistory = (): UsePaymentHistoryReturn => {
  const [data, setData] = useState<WeeklyPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData: user, loading: userLoading, error: userError } = useProfileUsers();

  const getWeekBounds = (date: Date) => {
    // Quinta-feira é dia 4 (0=domingo, 1=segunda, ..., 4=quinta)
    const dayOfWeek = date.getDay();
    const daysFromThursday = (dayOfWeek + 3) % 7; // Quantos dias desde a última quinta
    
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - daysFromThursday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { weekStart, weekEnd };
  };

  const fetchPaymentHistory = async () => {
    if (userLoading || !user?.cpf) {
      if (!userLoading && !user?.cpf) {
        setError('CPF não encontrado no perfil');
        setLoading(false);
      }
      return;
    }

    if (userError) {
      setError(userError);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (!user?.apelido) {
        throw new Error('Apelido não encontrado no perfil');
      }

      // Use base_de_vendas table instead of view to avoid TypeScript issues
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('base_de_vendas')
        .select('comissao_integral_sinal, data_do_contrato')
        .eq('vendedor_parceiro', user.apelido)
        .order('data_do_contrato', { ascending: false });

      if (paymentsError) {
        throw new Error('Erro ao buscar histórico de pagamentos');
      }

      // Agrupar por semana (quinta a quarta)
      const weeklyData = new Map<string, { total: number; count: number; weekStart: Date; weekEnd: Date }>();

      paymentsData?.forEach(payment => {
        if (payment.data_do_contrato) {
          const paymentDate = new Date(payment.data_do_contrato);
          const { weekStart, weekEnd } = getWeekBounds(paymentDate);
          const weekKey = weekStart.toISOString().split('T')[0];

          if (!weeklyData.has(weekKey)) {
            weeklyData.set(weekKey, {
              total: 0,
              count: 0,
              weekStart,
              weekEnd
            });
          }

          const week = weeklyData.get(weekKey)!;
          week.total += Number(payment.comissao_integral_sinal) || 0;
          week.count += 1;
        }
      });

      // Converter para array e ordenar por data (mais recente primeiro)
      const weeklyArray: WeeklyPayment[] = Array.from(weeklyData.values())
        .map(week => ({
          weekStart: week.weekStart.toLocaleDateString('pt-BR'),
          weekEnd: week.weekEnd.toLocaleDateString('pt-BR'),
          totalValue: week.total,
          paymentCount: week.count
        }))
        .sort((a, b) => new Date(b.weekStart.split('/').reverse().join('-')).getTime() - 
                       new Date(a.weekStart.split('/').reverse().join('-')).getTime());

      setData(weeklyArray);
    } catch (err) {
      console.error('Erro ao buscar histórico de pagamentos:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [user, userLoading, userError]);

  return {
    data,
    loading,
    error,
    refetch: fetchPaymentHistory,
  };
};