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

export const useOutros = (viewAsAdmin = false) => {
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

        // Buscar role do usuário
        const { data: userRoleData } = await supabase
          .from('users')
          .select('role, apelido')
          .eq('name', userData.name)
          .maybeSingle();

        const userRole = userRoleData?.role;
        const userApelido = userRoleData?.apelido;

        let query = (supabase as any)
          .from("outros")
          .select("*")
          .eq("periodo_id", period.id);

        // Filtrar por hierarquia se não for admin
        if (!viewAsAdmin) {
          if (userRole === "diretor") {
            // Buscar superintendentes da diretoria
            const { data: superintendentes } = await supabase
              .from("users")
              .select("apelido")
              .eq("role", "superintendente")
              .eq("diretor", userApelido);
            
            const superList = superintendentes?.map(s => s.apelido) || [];
            
            if (superList.length > 0) {
              // Buscar nomes completos dos usuários dessa diretoria
              const { data: teamUsers } = await supabase
                .from("users")
                .select("name")
                .in("superintendente", superList);
              
              const nameList = teamUsers?.map(u => u.name) || [];
              
              if (nameList.length > 0) {
                query = query.in("nome_completo", nameList);
              }
            }
          } else {
            // Corretor, gerente, superintendente veem apenas os próprios
            query = query.eq("nome_completo", userData.name);
          }
        }

        const { data, error } = await query.order("created_at", { ascending: false });

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
  }, [period?.id, loadingPeriod, userData?.name, loadingUser, viewAsAdmin]);

  return {
    outros,
    loading,
    error: error || errorPeriod || errorUser,
  };
};
