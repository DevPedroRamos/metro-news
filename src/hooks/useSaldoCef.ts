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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const fetchSaldoCef = useCallback(async () => {
    try {
      if (periodLoading || !period?.id || period.id <= 0) return;
      if (userLoading || !user?.apelido) return;
      if (roleLoading) return;
      if (periodError) throw new Error(periodError);
      if (userError) throw new Error(userError);

      setLoading(true);
      setError(null);

      let query = supabase
        .from("saldo_cef")
        .select("*")
        .eq("periodo_id", period.id);

      // Apply role-based filtering
      // Se for superintendente, busca registros onde ele é o superintendente
      // Se for gerente, busca registros onde ele é o gerente
      // Caso contrário, busca registros onde ele é o vendedor
      if (userRole === "superintendente") {
        query = query.eq("superintendente", user.apelido);
      } else if (userRole === "gerente") {
        query = query.eq("gerente", user.apelido);
      } else {
        query = query.eq("vendedor_parceiro", user.apelido);
      }

      const { data: rows, error } = await query.order("created_at", { ascending: false });

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
    period?.id,
    periodLoading,
    periodError,
    user?.apelido,
    userLoading,
    userError,
    userRole,
    roleLoading,
  ]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.apelido) return;
      
      try {
        setRoleLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('apelido', user.apelido)
          .maybeSingle();

        if (error) throw error;
        setUserRole(data?.role || null);
      } catch (err) {
        console.error('Erro ao buscar role do usuário:', err);
        setUserRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.apelido]);

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
