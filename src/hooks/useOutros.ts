import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPeriod } from "@/hooks/useCurrentPeriod";
import { useProfileUsers } from "@/hooks/useProfileUsers";

export interface Outro {
  id: string;
  nome_completo: string;
  valor: number;
  descricao: string;
  created_at: string;
}

export const useOutros = () => {
  const { period, loading: loadingPeriod, error: errorPeriod } = useCurrentPeriod();
  const { userData, loading: loadingUser, error: errorUser } = useProfileUsers();

  const [outros, setOutros] = useState<Outro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingPeriod || loadingUser || !period?.id || period.id <= 0 || !userData?.name) return;

    const fetchOutros = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await (supabase as any)
          .from("outros")
          .select("*")
          .eq("periodo_id", period.id)
          .eq("nome_completo", userData.name)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setOutros(data?.map(item => ({
          ...item,
          id: String(item.id),
        })) || []);
      } catch (err) {
        console.error("Erro ao buscar outros:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchOutros();
  }, [period?.id, loadingPeriod, userData?.name, loadingUser]);

  return {
    outros,
    loading,
    error: error || errorPeriod || errorUser,
  };
};
