import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileUsers } from "./useProfileUsers";
import { useCurrentPeriod } from "./useCurrentPeriod";

export interface PaymentData {
  period_start: string; // BR
  period_end: string;   // BR
  pagamento: string | null;
  receita: {
    valor_base: number;
    pagar: number;
    comissao: number;
    premio: number;
    saldo_cef: number;
    outras: number;
  };
  descontos: {
    adiantamento: number;
    antecipacao: number;
    distrato: number;
    outros: number;
    saldo_permuta: number;
    saldo_neg_periodos_anteriores: number;
  };
  saldo_negativo_total: number;
}

export interface PaymentHistoryItem {
  id: string;
  period_start: string;
  period_end: string;
  pagamento: string | null;
  receita_total: number;
  descontos_total: number;
  total_receber: number;
  created_at: string;
}

export const usePayments = (cpfOverride?: string) => {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const { userData: user, loading: userLoading, error: userError } = useProfileUsers();
  const { period, loading: periodLoading, error: periodError } = useCurrentPeriod();

  // Use cpfOverride if provided (for admin viewing other users), otherwise use current user's CPF
  const effectiveCpf = cpfOverride || user?.cpf;

  const fetchPaymentData = async () => {
    try {
      if (userLoading || periodLoading || !effectiveCpf || !period || !period.id || period.id <= 0) return;
      if (userError) throw new Error(userError);
      if (periodError) throw new Error(periodError);

      setLoading(true);
      setError(null);

      // Query resume data for the current period and effective user
      const { data: rows, error } = await (supabase as any)
        .from("resume")
        .select("*")
        .eq("cpf", effectiveCpf)
        .eq("periodo_id", period.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      const row = rows?.[0];

      if (row) {
        const mapped: PaymentData = {
          period_start: period.start,
          period_end: period.end,
          pagamento: row.pagamento || null,
          receita: {
            valor_base: Number(row.valor_base || 0),
            pagar: Number(row.pagar || 0),
            comissao: Number(row.comissao || 0),
            premio: Number(row.premio || 0),
            saldo_cef: Number(row.saldo_cef || 0),
            outras: Number(row.outras || 0),
          },
          descontos: {
            adiantamento: Number(row.adiantamento || 0),
            antecipacao: Number(row.antecipacao || 0),
            distrato: Number(row.distrato || 0),
            outros: Number(row.outros || 0),
            saldo_permuta: Number(row.saldo_permuta || 0),
            saldo_neg_periodos_anteriores: Number(row.saldo_neg_periodos_anteriores || 0),
          },
          saldo_negativo_total:
            Number(row.adiantamento || 0) +
            Number(row.antecipacao || 0) +
            Number(row.distrato || 0) +
            Number(row.outros || 0) +
            Number(row.saldo_permuta || 0) +
            Number(row.saldo_neg_periodos_anteriores || 0),
        };

        setData(mapped);
      } else {
        // sem linha -> zera, mas preserva o período calculado
        setData({
          period_start: period.start,
          period_end: period.end,
          pagamento: null,
          receita: {
            valor_base: 0,
            pagar: 0,
            comissao: 0,
            premio: 0,
            saldo_cef: 0,
            outras: 0,
          },
          descontos: {
            adiantamento: 0,
            antecipacao: 0,
            distrato: 0,
            outros: 0,
            saldo_permuta: 0,
            saldo_neg_periodos_anteriores: 0,
          },
          saldo_negativo_total: 0,
        });
      }
    } catch (err) {
      console.error("Erro ao carregar pagamentos", err);
      setError("Não foi possível carregar os pagamentos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    if (!effectiveCpf || !period || !period.id || period.id <= 0) return;
    try {
      setHistoryLoading(true);

      // Query para buscar histórico com JOIN para obter as datas dos períodos
      const { data: historyData, error: historyError } = await (supabase as any)
        .rpc('get_payment_history', { 
          user_cpf: effectiveCpf, 
          current_period_id: period.id 
        });

      if (historyError) throw historyError;

      if (historyData && historyData.length > 0) {
        const historicalItems = historyData.map((row: any) => {
          const receitaTotal =
            Number(row.pagar || 0) +
            Number(row.comissao || 0) +
            Number(row.premio || 0) +
            Number(row.outras || 0);

        const descontosTotal =
            Number(row.adiantamento || 0) +
            Number(row.antecipacao || 0) +
            Number(row.distrato || 0) +
            Number(row.outros || 0) +
            Number(row.saldo_permuta || 0) +
            Number(row.saldo_neg_periodos_anteriores || 0);

          // Formatando as datas do período para o formato brasileiro
          const formatDate = (dateStr: string) => {
            if (!dateStr) return "";
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
          };

          return {
            id: row.id,
            period_start: formatDate(row.period_start),
            period_end: formatDate(row.period_end),
            pagamento: row.pagamento || null,
            receita_total: receitaTotal,
            descontos_total: descontosTotal,
            total_receber: receitaTotal - descontosTotal,
            created_at: row.created_at,
          } as PaymentHistoryItem;
        });

        setHistory(historicalItems);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Erro ao carregar histórico de pagamentos:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Totais agregados
  const totalReceita = useMemo(() => {
    if (!data) return 0;
    return (
      (data.receita.pagar || 0) +
      (data.receita.comissao || 0) +
      (data.receita.premio || 0) +
      (data.receita.outras || 0) +
      (data.receita.saldo_cef || 0)
    );
  }, [data]);

  const totalDescontos = useMemo(() => {
    if (!data) return 0;
    return Object.values(data.descontos).reduce((sum, v) => sum + (Number(v) || 0), 0);
  }, [data]);

  const totalReceber = useMemo(() => totalReceita - totalDescontos, [totalReceita, totalDescontos]);

  const receitaItems = useMemo(
    () => [
      { key: "valor_base", label: "Fixo", value: data?.receita.valor_base ?? 0 },
      { key: "pagar", label: "Pagamento Semanal", value: data?.receita.pagar ?? 0 },
      { key: "comissao", label: "Comissão", value: data?.receita.comissao ?? 0 },
      { key: "premio", label: "Prêmio", value: data?.receita.premio ?? 0 },
      { key: "saldo_cef", label: "Saldo Cef", value: data?.receita.saldo_cef ?? 0 },
      { key: "outras", label: "Outras", value: data?.receita.outras ?? 0 },
    ],
    [data]
  );

  const descontoItems = useMemo(
    () => [
      { key: "adiantamento", label: "Adiantamento", value: data?.descontos.adiantamento ?? 0 },
      { key: "antecipacao", label: "Antecipação", value: data?.descontos.antecipacao ?? 0 },
      { key: "distrato", label: "Distrato", value: data?.descontos.distrato ?? 0 },
      { key: "outros", label: "Outros", value: data?.descontos.outros ?? 0 },
      { key: "saldo_permuta", label: "Saldo Permuta", value: data?.descontos.saldo_permuta ?? 0 },
      { key: "saldo_neg_periodos_anteriores", label: "Saldo Neg. de Períodos Anteriores", value: data?.descontos.saldo_neg_periodos_anteriores ?? 0 },
    ],
    [data]
  );

  useEffect(() => {
    fetchPaymentData();
  }, [user, userLoading, userError, period, periodLoading, periodError, cpfOverride]);

  useEffect(() => {
    fetchPaymentHistory();
  }, [user, period, cpfOverride]);

  return {
    data,
    loading,
    error,
    history,
    historyLoading,
    totalReceita,
    totalDescontos,
    totalReceber,
    receitaItems,
    descontoItems,
    refetch: fetchPaymentData,
    refetchHistory: fetchPaymentHistory,
  };
};
