import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentPeriod } from "@/hooks/useCurrentPeriod";
import { useProfileUsers } from "@/hooks/useProfileUsers";

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

export const useDistrato = (viewAsAdmin = false) => {
  const { period, loading: loadingPeriod, error: errorPeriod } = useCurrentPeriod();
  const { userData, loading: loadingUserData, error: errorUserData } = useProfileUsers();

  const [distratos, setDistratos] = useState<Distrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userData?.apelido) return;
      
      try {
        setRoleLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('apelido', userData.apelido)
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
  }, [userData?.apelido]);

  useEffect(() => {
    if (loadingPeriod || loadingUserData || roleLoading || !period?.id || period.id <= 0 || !userData?.apelido) return;

    const fetchDistratos = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("distrato")
          .select("*")
          .eq("periodo_id", period.id);

        // Filtrar baseado na role apenas se não for admin
        if (!viewAsAdmin) {
          if (userRole === "superintendente") {
            query = query.ilike("superintendente", userData.apelido);
          } else if (userRole === "gerente") {
            query = query.ilike("gerente", userData.apelido);
          } else if (userRole === "diretor") {
            // NOVO: Buscar superintendentes da diretoria
            const { data: superintendentes, error: superError } = await supabase
              .from("users")
              .select("apelido")
              .eq("role", "superintendente")
              .eq("diretor", userData.apelido);

            if (superError) throw superError;

            const superList = superintendentes?.map(s => s.apelido) || [];

            if (superList.length > 0) {
              query = query.in("superintendente", superList);
            }
          } else {
            query = query.ilike("vendedor", userData.apelido);
          }
        }

        const { data, error } = await query.order("created_at", { ascending: false });

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
  }, [period?.id, loadingPeriod, userData?.apelido, loadingUserData, userRole, roleLoading]);

  return {
    distratos,
    loading,
    error: error || errorPeriod || errorUserData,
    userRole,
  };
};
