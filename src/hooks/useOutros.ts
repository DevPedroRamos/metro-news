import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPeriod } from "@/hooks/useCurrentPeriod";

export interface Outro {
  id: string;
  nome_completo: string;
  valor: number;
  descricao: string;
  created_at: string;
}

export const useOutros = () => {
  const { period, loading: loadingPeriod, error: errorPeriod } = useCurrentPeriod();

  const [outros, setOutros] = useState<Outro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingPeriod || !period?.isoStart || !period?.isoEnd) return;

    const fetchOutros = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("outros")
          .select("*")
          .gte("created_at", period.isoStart)
          .lte("created_at", period.isoEnd)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setOutros((data as Outro[]) || []);
      } catch (err) {
        console.error("Erro ao buscar outros:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchOutros();
  }, [period?.isoStart, period?.isoEnd, loadingPeriod]);

  return {
    outros,
    loading,
    error: error || errorPeriod,
  };
};
