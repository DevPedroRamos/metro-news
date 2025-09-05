import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileUsers } from "./useProfileUsers";
import { useCurrentPeriod } from "./useCurrentPeriod";

export interface Venda {
  id: number;
  data_do_contrato: string;
  tipo_venda: string;
  data_sicaq: string | null;
  data_pagto: string | null;
  cliente: string;
  empreendimento: string;
  bl: string | null;
  unid: string;
  vlr_tabela: number;
  vlr_venda: number;
  perc_desconto: number | null;
  vlr_contrato: number;
  fluxo: number | null;
  entrada: number | null;
  recebido: number | null;
  receber: number | null;
  c_credito_baixada: number | null;
  c_credito_em_aberto: number | null;
  c_desconto_baixada: number | null;
  c_desconto_em_aberto: number | null;
  recebido_de_sinal: number | null;
  perc_sinal_recebido: number | null;
  assinatura_cef: string | null;
  origem: string | null;
  vendedor_parceiro: string | null;
  supervisor_coord_parceiro: string | null;
  gerente: string | null;
  superintendente: string | null;
  diretor: string | null;
  comissao_sinal_perc: number | null;
  comissao_vgv_pre_chaves_perc: number | null;
  comissao_extra_perc: number | null;
  comissao_integral_sinal: number | null;
  comissao_integral_vgv_pre_chaves: number | null;
  comissao_integral_extra: number | null;
  sinal_comissao_extra_vendedor: number | null;
  created_at: string;
}

export interface VendasData {
  vendas: Venda[];
  totais: {
    vlr_venda: number;
    vlr_contrato: number;
    recebido: number;
    receber: number;
    comissao_integral_sinal: number;
    comissao_integral_vgv_pre_chaves: number;
    comissao_integral_extra: number;
  };
}

// helpers de data
const brToISODate = (br: string) => {
  // br: DD/MM/YYYY -> YYYY-MM-DD
  const [d, m, y] = br.split("/");
  if (!d || !m || !y) return undefined;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
};

const dayStartISO = (isoDateYMD: string) =>
  new Date(`${isoDateYMD}T00:00:00.000Z`).toISOString();

const nextDayStartISO = (isoDateYMD: string) => {
  const dt = new Date(`${isoDateYMD}T00:00:00.000Z`);
  dt.setDate(dt.getDate() + 1);
  return dt.toISOString(); // exclusivo
};

export const useVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userData: user, loading: userLoading, error: userError } = useProfileUsers();
  const { period, loading: periodLoading, error: periodError } = useCurrentPeriod();

  const fetchVendas = async () => {
    try {
      if (userLoading || periodLoading || !user?.id || !period || !period.id || period.id <= 0) return;
      if (userError) throw new Error(userError);
      if (periodError) throw new Error(periodError);

      setLoading(true);
      setError(null);

      // Buscar apelido (igual seus outros hooks)
      const { data: userRow, error: userErr } = await supabase
        .from("users")
        .select("apelido")
        .eq("id", user.id)
        .single();

      if (userErr || !userRow?.apelido) {
        throw new Error("Não foi possível carregar o apelido do usuário.");
      }

      const apelido: string = userRow.apelido;

      // Filtra por vendedor + periodo_id
      const { data, error } = await (supabase as any)
        .from("base_de_vendas")
        .select("*")
        .eq("vendedor_parceiro", apelido)
        .eq("periodo_id", period.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setVendas((data || []) as unknown as Venda[]);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
      setError("Não foi possível carregar as vendas.");
    } finally {
      setLoading(false);
    }
  };

  const totais = useMemo(
    () => ({
      vlr_venda: vendas.reduce((s, v) => s + (v.vlr_venda || 0), 0),
      vlr_contrato: vendas.reduce((s, v) => s + (v.vlr_contrato || 0), 0),
      recebido: vendas.reduce((s, v) => s + (v.recebido || 0), 0),
      receber: vendas.reduce((s, v) => s + (v.receber || 0), 0),
      comissao_integral_sinal: vendas.reduce((s, v) => s + (v.comissao_integral_sinal || 0), 0),
      comissao_integral_vgv_pre_chaves: vendas.reduce(
        (s, v) => s + (v.comissao_integral_vgv_pre_chaves || 0),
        0
      ),
      comissao_integral_extra: vendas.reduce((s, v) => s + (v.comissao_integral_extra || 0), 0),
    }),
    [vendas]
  );

  useEffect(() => {
    fetchVendas();
  }, [user, userLoading, userError, period?.id, periodLoading, periodError]);

  const data: VendasData = useMemo(
    () => ({
      vendas,
      totais,
    }),
    [vendas, totais]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchVendas,
  };
};
