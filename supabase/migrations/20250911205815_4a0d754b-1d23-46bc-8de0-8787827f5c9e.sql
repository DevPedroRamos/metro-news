-- Update get_profile_stats function to use base_de_vendas table with correct column mappings
CREATE OR REPLACE FUNCTION public.get_profile_stats(user_uuid uuid)
RETURNS TABLE(
  user_id uuid,
  user_name character varying,
  user_apelido character varying,
  user_cpf character varying,
  user_gerente character varying,
  user_superintendente character varying,
  user_role character varying,
  avatar_url text,
  cover_url text,
  vendas_count bigint,
  recebimento numeric,
  contratos_count bigint,
  visitas_count bigint,
  ranking_position bigint,
  total_users bigint
)
LANGUAGE plpgsql
AS $$
DECLARE
  current_month_start DATE := DATE_TRUNC('month', CURRENT_DATE);
  current_month_end DATE := DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day';
  user_name_var TEXT;
BEGIN
  -- Get user name for sales lookup
  SELECT u.name INTO user_name_var
  FROM users u 
  WHERE u.id = user_uuid;

  RETURN QUERY
  WITH user_data AS (
    SELECT 
      u.id,
      u.name,
      u.apelido,
      u.cpf,
      u.gerente,
      u.superintendente,
      u.role,
      p.avatar_url,
      p.cover_url
    FROM users u
    LEFT JOIN profiles p ON u.id = p.id
    WHERE u.id = user_uuid
  ),
  sales_data AS (
    SELECT 
      COUNT(*) as sales_count,
      COALESCE(SUM(bv.recebido), 0) as revenue,
      COUNT(CASE WHEN bv.tipo_venda ILIKE '%contrato%' THEN 1 END) as contracts_count
    FROM base_de_vendas bv
    WHERE bv.vendedor_parceiro = user_name_var
      AND bv.data_do_contrato >= current_month_start 
      AND bv.data_do_contrato <= current_month_end
  ),
  visits_data AS (
    SELECT COUNT(*) as visits_count
    FROM visits v
    WHERE v.corretor_id = user_uuid
      AND v.horario_entrada >= current_month_start 
      AND v.horario_entrada <= current_month_end
  ),
  ranking_data AS (
    SELECT 
      COUNT(*) as total_users,
      COALESCE(
        (
          SELECT COUNT(*) + 1
          FROM (
            SELECT 
              u2.id,
              COUNT(bv2.*) as user_sales_count
            FROM users u2
            LEFT JOIN base_de_vendas bv2 ON u2.name = bv2.vendedor_parceiro
              AND bv2.data_do_contrato >= current_month_start 
              AND bv2.data_do_contrato <= current_month_end
            WHERE u2.role = 'corretor'
            GROUP BY u2.id
            HAVING COUNT(bv2.*) > (SELECT sales_count FROM sales_data)
          ) higher_sales
        ), 1
      ) as position
    FROM users u3
    WHERE u3.role = 'corretor'
  )
  SELECT 
    ud.id,
    ud.name,
    ud.apelido,
    ud.cpf,
    ud.gerente,
    ud.superintendente,
    ud.role,
    ud.avatar_url,
    ud.cover_url,
    COALESCE(sd.sales_count, 0),
    COALESCE(sd.revenue, 0),
    COALESCE(sd.contracts_count, 0),
    COALESCE(vd.visits_count, 0),
    rd.position,
    rd.total_users
  FROM user_data ud
  CROSS JOIN sales_data sd
  CROSS JOIN visits_data vd
  CROSS JOIN ranking_data rd;
END;
$$;