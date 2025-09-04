import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileUsers } from "./useProfileUsers";

export interface Period {
  /** formato DD/MM/YYYY (para UI e hooks que esperam esse formato) */
  start: string;
  end: string;
  /** formato YYYY-MM-DD (útil para queries) */
  isoStart: string;
  isoEnd: string;
  /** metadados da linha de resume usada para definir o período */
  sourceResumeId?: string;
  sourceCreatedAt?: string; // ISO datetime
}

const formatBR = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatISODate = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const useCurrentPeriod = () => {
  const [period, setPeriod] = useState<Period | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userData: user, loading: userLoading, error: userError } = useProfileUsers();

  const computePeriodFromCreatedAt = (createdAtISO: string) => {
    const createdDate = new Date(createdAtISO);
    const createdDay = createdDate.getDay(); // 0..6 (0=Dom)
    // mesma regra usada no usePayments original
    const lastThursday = new Date(createdDate);
    const daysSinceLastThursday = (createdDay + 7 - 4) % 7 || 7; // 4=Qui
    lastThursday.setDate(createdDate.getDate() - daysSinceLastThursday);

    const nextWednesday = new Date(lastThursday);
    nextWednesday.setDate(lastThursday.getDate() + 6);

    return {
      startBR: formatBR(lastThursday),
      endBR: formatBR(nextWednesday),
      startISO: formatISODate(lastThursday),
      endISO: formatISODate(nextWednesday),
    };
  };

  const fetchCurrentPeriod = useCallback(async () => {
    try {
      if (userLoading || !user?.cpf) return;
      if (userError) throw new Error(userError);

      setLoading(true);
      setError(null);

      // pega a ÚLTIMA linha de resume do usuário logado
      const { data: rows, error } = await supabase
        .from("resume")
        .select("id, created_at")
        .eq("cpf", user.cpf)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      const row = rows?.[0];
      if (!row) {
        // sem resume -> período vazio, mas consistente
        setPeriod({
          start: "",
          end: "",
          isoStart: "",
          isoEnd: "",
        });
        return;
      }

      const { startBR, endBR, startISO, endISO } = computePeriodFromCreatedAt(row.created_at);

      setPeriod({
        start: startBR,
        end: endBR,
        isoStart: startISO,
        isoEnd: endISO,
        sourceResumeId: String(row.id),
        sourceCreatedAt: row.created_at,
      });
    } catch (err) {
      console.error("Erro ao calcular período atual", err);
      setError("Não foi possível calcular o período atual.");
      setPeriod({
        start: "",
        end: "",
        isoStart: "",
        isoEnd: "",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.cpf, userLoading, userError]);

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
