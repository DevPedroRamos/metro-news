import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileUsers } from "./useProfileUsers";
import { PeriodProps } from "@/types/period";

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

// Função para converter data de DD/MM/YYYY para YYYY-MM-DD
function formatDateToISO(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  
  const [day, month, year] = dateStr.split('/');
  if (day && month && year) {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return undefined;
}

export const useVendas = ({ periodStart, periodEnd }: PeriodProps = {}) => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { userData: user, loading: userLoading, error: userError } = useProfileUsers();

  const fetchVendas = async () => {
    try {
      if (userLoading || !user?.id) {
        console.log('Aguardando carregamento do usuário...');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      if (userError) {
        throw new Error(userError);
      }

      console.log('Buscando dados do usuário...');
      const { data: userData, error: userError2 } = await supabase
        .from('users')
        .select('apelido')
        .eq('id', user.id)
        .single();
        
      if (userError2 || !userData) {
        throw new Error('Não foi possível carregar os dados do usuário');
      }

      const apelido = userData.apelido;
      console.log('Apelido do usuário:', apelido);
      
      // Converter datas para o formato ISO se existirem
      const isoStartDate = periodStart ? formatDateToISO(periodStart) : undefined;
      const isoEndDate = periodEnd ? formatDateToISO(periodEnd) : undefined;
      
      console.log('Buscando vendas para o período:', { isoStartDate, isoEndDate });
      
      let query = supabase
        .from('base_de_vendas')
        .select('*')
        .eq('vendedor_parceiro', apelido);
      
      if (isoStartDate) {
        query = query.gte('data_do_contrato', isoStartDate);
      }
      
      if (isoEndDate) {
        query = query.lte('data_do_contrato', isoEndDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log('Vendas encontradas:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Primeira venda:', data[0]);
      }
      
      setVendas((data || []) as unknown as Venda[]);
    } catch (err) {
      console.error('Erro ao carregar vendas:', err);
      setError('Não foi possível carregar as vendas. ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Calcular totais
  const totais = useMemo(() => ({
    vlr_venda: vendas.reduce((sum, venda) => sum + (venda.vlr_venda || 0), 0),
    vlr_contrato: vendas.reduce((sum, venda) => sum + (venda.vlr_contrato || 0), 0),
    recebido: vendas.reduce((sum, venda) => sum + (venda.recebido || 0), 0),
    receber: vendas.reduce((sum, venda) => sum + (venda.receber || 0), 0),
    comissao_integral_sinal: vendas.reduce(
      (sum, venda) => sum + (venda.comissao_integral_sinal || 0),
      0
    ),
    comissao_integral_vgv_pre_chaves: vendas.reduce(
      (sum, venda) => sum + (venda.comissao_integral_vgv_pre_chaves || 0),
      0
    ),
    comissao_integral_extra: vendas.reduce(
      (sum, venda) => sum + (venda.comissao_integral_extra || 0),
      0
    ),
  }), [vendas]);

  // Buscar vendas quando o usuário ou o período mudar
  useEffect(() => {
    if (!userLoading && user?.id) {
      fetchVendas();
    }
  }, [user, userLoading, periodStart, periodEnd]);

  // Preparar os dados para retorno
  const data: VendasData = useMemo(() => ({
    vendas,
    totais
  }), [vendas, totais]);

  return {
    data,
    loading,
    error,
    refetch: fetchVendas,
  };
};
