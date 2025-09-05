import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Period {
  /** ID do período na tabela payments.periodo */
  id: number;
  /** formato DD/MM/YYYY (para UI e hooks que esperam esse formato) */
  start: string;
  end: string;
  /** formato YYYY-MM-DD (útil para queries) */
  isoStart: string;
  isoEnd: string;
}

const formatBR = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const useCurrentPeriod = () => {
  const [period, setPeriod] = useState<Period | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentPeriod = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the latest period from payments.periodo
      const { data: periods, error } = await supabase.rpc("get_current_period" as any);

      if (error) throw error;

      if (periods) {
        setPeriod({
          id: periods.id,
          start: formatBR(periods.start),
          end: formatBR(periods.end),
          isoStart: periods.start,
          isoEnd: periods.end,
        });
      } else {
        // No period found - set empty period
        setPeriod({
          id: 0,
          start: "",
          end: "",
          isoStart: "",
          isoEnd: "",
        });
      }
    } catch (err) {
      console.error("Erro ao buscar período atual", err);
      setError("Não foi possível buscar o período atual.");
      setPeriod({
        id: 0,
        start: "",
        end: "",
        isoStart: "",
        isoEnd: "",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentPeriod();
  }, [fetchCurrentPeriod]);

  return {
    period,
    loading,
    error,
    refetch: fetchCurrentPeriod,
  };
};
