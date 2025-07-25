-- Corrigir a função get_profile_stats para buscar corretamente as imagens do perfil
CREATE OR REPLACE FUNCTION public.get_profile_stats(user_uuid uuid)
 RETURNS TABLE(user_id uuid, user_name character varying, user_apelido character varying, user_cpf character varying, user_gerente character varying, user_superintendente character varying, user_role character varying, avatar_url text, cover_url text, vendas_count bigint, recebimento numeric, contratos_count bigint, visitas_count bigint, ranking_position bigint, total_users bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
  user_cpf_var varchar;
BEGIN
  -- Get user CPF first
  SELECT p.cpf INTO user_cpf_var 
  FROM profiles p 
  WHERE p.id = user_uuid;

  RETURN QUERY
  WITH user_data AS (
    SELECT 
      u.id,
      u.name,
      u.apelido,
      u.cpf,
      u.gerente,
      u.superintendente,
      u.role
    FROM users u
    WHERE u.cpf = user_cpf_var
  ),
  profile_data AS (
    SELECT 
      avatar_url,
      cover_url
    FROM profiles p
    WHERE p.id = user_uuid
  ),
  sales_metrics AS (
    SELECT 
      COUNT(CASE WHEN status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as vendas,
      COALESCE(SUM(CASE WHEN status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN sinal ELSE 0 END), 0) as recebimento,
      COUNT(CASE WHEN status NOT IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as contratos
    FROM sales 
    WHERE corretor_cpf = user_cpf_var
  ),
  visits_metrics AS (
    SELECT 
      COUNT(*) as visitas
    FROM visits v
    JOIN users u ON v.corretor_id = u.id
    WHERE u.cpf = user_cpf_var
      AND DATE_TRUNC('month', v.horario_entrada) = DATE_TRUNC('month', CURRENT_DATE)
  ),
  ranking_data AS (
    SELECT 
      u.cpf,
      COUNT(CASE WHEN s.status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as sales_count,
      COALESCE(SUM(CASE WHEN s.status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN s.sinal ELSE 0 END), 0) as revenue,
      ROW_NUMBER() OVER (
        ORDER BY 
          COUNT(CASE WHEN s.status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) DESC, 
          COALESCE(SUM(CASE WHEN s.status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN s.sinal ELSE 0 END), 0) DESC
      ) as rank
    FROM users u
    LEFT JOIN sales s ON u.cpf = s.corretor_cpf
    WHERE u.role = 'corretor'
    GROUP BY u.cpf
  ),
  user_ranking AS (
    SELECT 
      rank as position,
      (SELECT COUNT(DISTINCT u.cpf) FROM users u WHERE u.role = 'corretor') as total
    FROM ranking_data 
    WHERE cpf = user_cpf_var
  )
  SELECT 
    ud.id,
    ud.name,
    ud.apelido,
    ud.cpf,
    ud.gerente,
    ud.superintendente,
    ud.role,
    pd.avatar_url,
    pd.cover_url,
    COALESCE(sm.vendas, 0),
    COALESCE(sm.recebimento, 0),
    COALESCE(sm.contratos, 0),
    COALESCE(vm.visitas, 0),
    COALESCE(ur.position, 0),
    COALESCE(ur.total, 0)
  FROM user_data ud
  CROSS JOIN profile_data pd
  CROSS JOIN sales_metrics sm
  CROSS JOIN visits_metrics vm
  LEFT JOIN user_ranking ur ON true;
END;
$function$