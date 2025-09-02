import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPeriod } from "@/hooks/useCurrentPeriod";

export interface Distrato {
  id: string;
  cliente: string;
  empreendimento: string;
  apto: string;
  dt_distrato: string;
  tipo_distrato: string;
  motivo: string;
  vendedor: string;
  supervisor: string;
  gerente: string;
  superintendente: string;
  diretor: string;
  valor_vendedor: number;
  valor_supervisor: number;
  valor_gerente: number;
  valor_superintendente: number;
  valor_gestor: number;
  valor_total: number;
  comissao_paga: boolean;
  descontar: boolean;
  observacao: string;
  created_at: string;
}

export const useDistrato = () => {
  const { period, loading: loadingPeriod, error: errorPeriod } = useCurrentPeriod();

  const [distratos, setDistratos] = useState<Distrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingPeriod || !period?.isoStart || !period?.isoEnd) return;

    const fetchDistratos = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("distrato")
          .select("*")
          .gte("created_at", period.isoStart)
          .lte("created_at", period.isoEnd)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setDistratos(data?.map(item => ({
          ...item,
          id: String(item.id),
        })) || []);
      } catch (err) {
        console.error("Erro ao buscar distratos:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchDistratos();
  }, [period?.isoStart, period?.isoEnd, loadingPeriod]);

  return {
    distratos,
    loading,
    error: error || errorPeriod,
  };
};
