import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileUsers } from "./useProfileUsers";

export interface PaymentData {
  period_start: string;
  period_end: string;
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
  receita_total: number;
  descontos_total: number;
  total_receber: number;
  created_at: string;
}

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const usePayments = () => {
  const [data, setData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PaymentHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const { userData: user, loading: userLoading, error: userError } = useProfileUsers();

  const fetchPaymentData = async () => {
    try {
      if (userLoading || !user?.id) return;
      
      setLoading(true);
      setError(null);
      
      if (userError) {
        throw new Error(userError);
      }
      
      // Buscamos os dados mais recentes do resume para este usuário
      const { data: rows, error } = await supabase
        .from('resume')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      const row = rows?.[0];
      if (row) {
        // Usar a data de criação do registro
        const createdDate = new Date(row.created_at);
        const createdDay = createdDate.getDay(); // 0 (domingo) a 6 (sábado)
        
        // Encontrar a última quinta-feira (dia 4) a partir da data de criação
        const lastThursday = new Date(createdDate);
        const daysSinceLastThursday = (createdDay + 7 - 4) % 7 || 7;
        lastThursday.setDate(createdDate.getDate() - daysSinceLastThursday);
        
        // Encontrar a próxima quarta-feira (6 dias após a última quinta)
        const nextWednesday = new Date(lastThursday);
        nextWednesday.setDate(lastThursday.getDate() + 6);
        
        const mapped: PaymentData = {
          period_start: formatDate(lastThursday),
          period_end: formatDate(nextWednesday),
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
        setData({
          period_start: "",
          period_end: "",
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
    if (!user?.id) return;
    
    try {
      setHistoryLoading(true);
      
      // Buscar histórico de pagamentos (todas as linhas, ordenadas por data de criação)
      const { data: historyData, error: historyError } = await supabase
        .from('resume')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (historyError) throw historyError;
      
      if (historyData && historyData.length > 0) {
        // Pular o primeiro item (já mostrado no topo)
        const historicalItems = historyData.slice(1).map((row: any) => {
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
            
          return {
            id: row.id,
            period_start: row.period_start || '',
            period_end: row.period_end || '',
            receita_total: receitaTotal,
            descontos_total: descontosTotal,
            total_receber: receitaTotal - descontosTotal,
            created_at: row.created_at
          };
        });
        
        setHistory(historicalItems);
      }
    } catch (err) {
      console.error('Erro ao carregar histórico de pagamentos:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Calcular totais
  const totalReceita = useMemo(() => {
    if (!data) return 0;
    return (data.receita.pagar || 0) + 
           (data.receita.comissao || 0) + 
           (data.receita.premio || 0) + 
           (data.receita.outras || 0) +
           (data.receita.saldo_cef || 0);
  }, [data]);

  const totalDescontos = useMemo(() => {
    if (!data) return 0;
    return Object.values(data.descontos).reduce((sum, value) => sum + (Number(value) || 0), 0);
  }, [data]);

  const totalReceber = useMemo(() => {
    return totalReceita - totalDescontos;
  }, [totalReceita, totalDescontos]);

  // Itens de receita e desconto para exibição
  const receitaItems = useMemo(() => ([
    { key: "valor_base", label: "Fixo", value: data?.receita.valor_base ?? 0 },
    { key: "pagar", label: "Pagamento Semanal", value: data?.receita.pagar ?? 0 },
    { key: "comissao", label: "Comissão", value: data?.receita.comissao ?? 0 },
    { key: "premio", label: "Prêmio", value: data?.receita.premio ?? 0 },
    { key: "saldo_cef", label: "Saldo Cef", value: data?.receita.saldo_cef ?? 0 },
    { key: "outras", label: "Outras", value: data?.receita.outras ?? 0 },
  ]), [data]);

  const descontoItems = useMemo(() => ([
    { key: "adiantamento", label: "Adiantamento", value: data?.descontos.adiantamento ?? 0 },
    { key: "antecipacao", label: "Antecipação", value: data?.descontos.antecipacao ?? 0 },
    { key: "distrato", label: "Distrato", value: data?.descontos.distrato ?? 0 },
    { key: "outros", label: "Outros", value: data?.descontos.outros ?? 0 },
    { key: "saldo_permuta", label: "Saldo Permuta", value: data?.descontos.saldo_permuta ?? 0 },
    { 
      key: "saldo_neg_periodos_anteriores", 
      label: "Saldo Neg. de Períodos Anteriores", 
      value: data?.descontos.saldo_neg_periodos_anteriores ?? 0 
    },
  ]), [data]);

  // Efeito para carregar os dados iniciais
  useEffect(() => {
    fetchPaymentData();
  }, [user, userLoading, userError]);

  // Efeito para carregar o histórico
  useEffect(() => {
    fetchPaymentHistory();
  }, [user]);

  return {
    // Dados
    data,
    loading,
    error,
    history,
    historyLoading,
    
    // Valores calculados
    totalReceita,
    totalDescontos,
    totalReceber,
    
    // Itens para exibição
    receitaItems,
    descontoItems,
    
    // Funções
    refetch: fetchPaymentData,
    refetchHistory: fetchPaymentHistory,
  };
};
