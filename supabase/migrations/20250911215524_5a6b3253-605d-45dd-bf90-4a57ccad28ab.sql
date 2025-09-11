-- Create function to get ranking position based on period like champions page
CREATE OR REPLACE FUNCTION public.get_user_ranking_position(user_uuid uuid, ranking_type text DEFAULT 'consultor')
RETURNS TABLE(user_position bigint, total_users bigint, vendas_count bigint)
LANGUAGE plpgsql
AS $$
DECLARE
  current_period_id bigint;
  user_name_var TEXT;
  user_apelido_var TEXT;
  user_gerente_var TEXT;
BEGIN
  -- Get current period
  SELECT p.id INTO current_period_id
  FROM payments.periodo p
  ORDER BY p.created_at DESC
  LIMIT 1;
  
  IF current_period_id IS NULL THEN
    RETURN QUERY
    SELECT 1::bigint as user_position, 1::bigint as total_users, 0::bigint as vendas_count;
    RETURN;
  END IF;

  -- Get user data
  SELECT u.name, u.apelido, u.gerente INTO user_name_var, user_apelido_var, user_gerente_var
  FROM profiles p
  LEFT JOIN users u ON p.cpf = u.cpf
  WHERE p.id = user_uuid;

  IF user_name_var IS NULL THEN
    RETURN QUERY
    SELECT 1::bigint as user_position, 1::bigint as total_users, 0::bigint as vendas_count;
    RETURN;
  END IF;

  IF ranking_type = 'consultor' THEN
    -- Calculate ranking for consultores based on vendedor_parceiro matches
    WITH user_sales AS (
      SELECT COUNT(*) as sales_count
      FROM base_de_vendas bv
      WHERE bv.periodo_id = current_period_id
        AND bv.vendedor_parceiro = user_name_var
    ),
    all_consultores AS (
      SELECT 
        bv.vendedor_parceiro,
        COUNT(*) as sales_count
      FROM base_de_vendas bv
      INNER JOIN users u ON u.name = bv.vendedor_parceiro
      WHERE bv.periodo_id = current_period_id
        AND u.role = 'corretor'
        AND bv.vendedor_parceiro IS NOT NULL
      GROUP BY bv.vendedor_parceiro
    ),
    ranking_calc AS (
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN ac.sales_count > (SELECT sales_count FROM user_sales) THEN 1 END) + 1 as position_calc
      FROM all_consultores ac
    )
    RETURN QUERY
    SELECT 
      rc.position_calc,
      rc.total_users,
      COALESCE(us.sales_count, 0)
    FROM ranking_calc rc
    CROSS JOIN user_sales us;

  ELSIF ranking_type = 'gerente' THEN
    -- Calculate ranking for gerentes based on gerente field matches
    WITH user_mentions AS (
      SELECT COUNT(*) as mentions_count
      FROM base_de_vendas bv
      WHERE bv.periodo_id = current_period_id
        AND bv.gerente = user_gerente_var
    ),
    all_gerentes AS (
      SELECT 
        bv.gerente,
        COUNT(*) as mentions_count
      FROM base_de_vendas bv
      WHERE bv.periodo_id = current_period_id
        AND bv.gerente IS NOT NULL
        AND bv.gerente != ''
      GROUP BY bv.gerente
    ),
    ranking_calc AS (
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN ag.mentions_count > (SELECT mentions_count FROM user_mentions) THEN 1 END) + 1 as position_calc
      FROM all_gerentes ag
    )
    RETURN QUERY
    SELECT 
      rc.position_calc,
      rc.total_users,
      COALESCE(um.mentions_count, 0)
    FROM ranking_calc rc
    CROSS JOIN user_mentions um;

  ELSE
    -- Default fallback
    RETURN QUERY
    SELECT 1::bigint as user_position, 1::bigint as total_users, 0::bigint as vendas_count;
  END IF;
END;
$$;