-- Fix get_profile_stats function to use CPF for user identification
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
  user_cpf_var TEXT;
  user_name_var TEXT;
BEGIN
  -- Get user CPF from profiles table using the auth user ID
  SELECT p.cpf INTO user_cpf_var
  FROM profiles p 
  WHERE p.id = user_uuid;

  -- If no CPF found, return empty result with defaults
  IF user_cpf_var IS NULL THEN
    RETURN QUERY
    SELECT 
      user_uuid as user_id,
      'Usuario'::varchar(100) as user_name,
      'Usuario'::varchar(100) as user_apelido,
      ''::varchar(100) as user_cpf,
      ''::varchar(100) as user_gerente,
      ''::varchar(100) as user_superintendente,
      'corretor'::varchar(100) as user_role,
      NULL::text as avatar_url,
      NULL::text as cover_url,
      0::bigint as vendas_count,
      0::numeric as recebimento,
      0::bigint as contratos_count,
      0::bigint as visitas_count,
      1::bigint as ranking_position,
      1::bigint as total_users;
    RETURN;
  END IF;

  -- Get user name from users table using CPF
  SELECT u.name INTO user_name_var
  FROM users u 
  WHERE u.cpf = user_cpf_var;

  RETURN QUERY
  WITH user_data AS (
    SELECT 
      user_uuid as id,
      COALESCE(u.name, 'Usuario') as name,
      COALESCE(u.apelido, 'Usuario') as apelido,
      COALESCE(u.cpf, '') as cpf,
      COALESCE(u.gerente, '') as gerente,
      COALESCE(u.superintendente, '') as superintendente,
      COALESCE(u.role, 'corretor') as role,
      p.avatar_url,
      p.cover_url
    FROM profiles p
    LEFT JOIN users u ON p.cpf = u.cpf
    WHERE p.id = user_uuid
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
              u2.cpf,
              COUNT(bv2.*) as user_sales_count
            FROM users u2
            LEFT JOIN base_de_vendas bv2 ON u2.name = bv2.vendedor_parceiro
              AND bv2.data_do_contrato >= current_month_start 
              AND bv2.data_do_contrato <= current_month_end
            WHERE u2.role = 'corretor'
            GROUP BY u2.cpf
            HAVING COUNT(bv2.*) > (SELECT sales_count FROM sales_data)
          ) higher_sales
        ), 1
      ) as position
    FROM users u3
    WHERE u3.role = 'corretor'
  )
  SELECT 
    ud.id,
    ud.name::varchar(100),
    ud.apelido::varchar(100),
    ud.cpf::varchar(100),
    ud.gerente::varchar(100),
    ud.superintendente::varchar(100),
    ud.role::varchar(100),
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