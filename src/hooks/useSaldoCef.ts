import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPeriod } from "./useCurrentPeriod";
import { useProfileUsers } from "./useProfileUsers";

export interface SaldoCef {
  id: number;
  cliente: string;
  empreendimento: string;
  bl: string;
  unid: string;
  vendedor_parceiro: string;
  supervisor_coord_parceiro: string | null;
  gerente: string | null;
  superintendente: string | null;
  gestor: string | null;
  comissao_sinal_perc: number | null;
  comissao_vgv_perc: number | null;
  comissao_extra_perc: number | null;
  comissao_sinal_valor: number | null;
  comissao_vgv_valor: number | null;
  premio_repasse_fiador_valor: number | null;
  vendedor_vgv_valor: number | null;
  vendedor_premio_repasse_fiador_valor: number | null;
  subtotal: number | null;
  total: number | null;
  created_at: string;
}

export const useSaldoCef = () => {
  const { period, loading: periodLoading, error: periodError } = useCurrentPeriod();
  const { userData: user, loading: userLoading, error: userError } = useProfileUsers();

  const [data, setData] = useState<SaldoCef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSaldoCef = useCallback(async () => {
    try {
      if (periodLoading || !period?.isoStart || !period?.isoEnd) return;
      if (userLoading || !user?.apelido) return;
      if (periodError) throw new Error(periodError);
      if (userError) throw new Error(userError);

      setLoading(true);
      setError(null);

      const { data: rows, error } = await supabase
        .from("saldo_cef")
        .select("*")
        .eq("vendedor_parceiro", user.apelido)
        .gte("created_at", period.isoStart)
        .lte("created_at", period.isoEnd)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setData(rows as SaldoCef[]);
    } catch (err: any) {
      console.error("Erro ao buscar saldo CEF", err);
      setError(err.message || "Erro ao buscar saldo CEF");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [
    period?.isoStart,
    period?.isoEnd,
    periodLoading,
    periodError,
    user?.apelido,
    userLoading,
    userError,
  ]);

  useEffect(() => {
    fetchSaldoCef();
  }, [fetchSaldoCef]);

  return {
    saldoCef: data,
    loading,
    error,
    refetch: fetchSaldoCef,
  };
};
