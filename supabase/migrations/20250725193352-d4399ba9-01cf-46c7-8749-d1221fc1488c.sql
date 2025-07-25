-- Corrigir a função get_profile_stats para usar os mesmos critérios de ranking
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
      u.role,
      p.avatar_url,
      p.cover_url
    FROM users u
    LEFT JOIN profiles p ON u.id = p.id
    WHERE u.cpf = user_cpf_var
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
  -- Usar a mesma lógica de ranking da função get_champions_ranking_optimized
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
    ud.avatar_url,
    ud.cover_url,
    COALESCE(sm.vendas, 0),
    COALESCE(sm.recebimento, 0),
    COALESCE(sm.contratos, 0),
    COALESCE(vm.visitas, 0),
    COALESCE(ur.position, 0),
    COALESCE(ur.total, 0)
  FROM user_data ud
  CROSS JOIN sales_metrics sm
  CROSS JOIN visits_metrics vm
  LEFT JOIN user_ranking ur ON true;
END;
$function$;

-- Corrigir a função get_champions_ranking_optimized para garantir tipos consistentes
CREATE OR REPLACE FUNCTION public.get_champions_ranking_optimized(ranking_type text DEFAULT 'corretor'::text, limit_count integer DEFAULT 10, offset_count integer DEFAULT 0)
 RETURNS TABLE(user_id uuid, name character varying, nickname character varying, sales_count bigint, revenue numeric, visits_count bigint, contracts_count bigint, avatar_url text, role character varying, total_count bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
  total_records bigint;
BEGIN
  -- Get total count based on ranking type
  IF ranking_type = 'corretor' THEN
    SELECT COUNT(DISTINCT u.id) INTO total_records
    FROM users u 
    WHERE u.role = 'corretor';
    
    RETURN QUERY
    WITH sales_data AS (
      SELECT 
        corretor_cpf,
        COUNT(CASE WHEN status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as sales_count,
        COALESCE(SUM(CASE WHEN status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN sinal ELSE 0 END), 0) as revenue,
        COUNT(CASE WHEN status NOT IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as contracts_count
      FROM sales 
      GROUP BY corretor_cpf
    ),
    visits_data AS (
      SELECT 
        u.id as user_id,
        COUNT(v.id) as visits_count
      FROM users u
      LEFT JOIN visits v ON u.id = v.corretor_id 
        AND DATE_TRUNC('month', v.horario_entrada) = DATE_TRUNC('month', CURRENT_DATE)
      WHERE u.role = 'corretor'
      GROUP BY u.id
    )
    SELECT 
      u.id,
      u.apelido::varchar(100),
      u.apelido::varchar(100),
      COALESCE(sd.sales_count, 0),
      COALESCE(sd.revenue, 0),
      COALESCE(vd.visits_count, 0),
      COALESCE(sd.contracts_count, 0),
      p.avatar_url,
      u.role::varchar(50),
      total_records
    FROM users u
    LEFT JOIN profiles p ON u.id = p.id
    LEFT JOIN sales_data sd ON u.cpf = sd.corretor_cpf
    LEFT JOIN visits_data vd ON u.id = vd.user_id
    WHERE u.role = 'corretor'
    ORDER BY COALESCE(sd.sales_count, 0) DESC, COALESCE(sd.revenue, 0) DESC
    LIMIT limit_count OFFSET offset_count;

  ELSIF ranking_type = 'gerente' THEN
    -- Similar logic for gerente but aggregated by gerente name
    SELECT COUNT(DISTINCT gerente) INTO total_records
    FROM users 
    WHERE gerente IS NOT NULL AND gerente != '';
    
    RETURN QUERY
    WITH gerente_data AS (
      SELECT DISTINCT gerente FROM users WHERE gerente IS NOT NULL AND gerente != ''
    ),
    aggregated_data AS (
      SELECT 
        gd.gerente,
        COALESCE(SUM(sd.sales_count), 0)::bigint as total_sales,
        COALESCE(SUM(sd.revenue), 0) as total_revenue,
        COALESCE(SUM(vd.visits_count), 0)::bigint as total_visits,
        COALESCE(SUM(sd.contracts_count), 0)::bigint as total_contracts
      FROM gerente_data gd
      LEFT JOIN users u ON gd.gerente = u.gerente
      LEFT JOIN (
        SELECT 
          corretor_cpf,
          COUNT(CASE WHEN status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as sales_count,
          COALESCE(SUM(CASE WHEN status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN sinal ELSE 0 END), 0) as revenue,
          COUNT(CASE WHEN status NOT IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as contracts_count
        FROM sales 
        GROUP BY corretor_cpf
      ) sd ON u.cpf = sd.corretor_cpf
      LEFT JOIN (
        SELECT 
          u2.id,
          COUNT(v.id) as visits_count
        FROM users u2
        LEFT JOIN visits v ON u2.id = v.corretor_id 
          AND DATE_TRUNC('month', v.horario_entrada) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY u2.id
      ) vd ON u.id = vd.id
      GROUP BY gd.gerente
    )
    SELECT 
      NULL::uuid,
      ad.gerente::varchar(100),
      ad.gerente::varchar(100),
      ad.total_sales,
      ad.total_revenue,
      ad.total_visits,
      ad.total_contracts,
      NULL::text,
      'gerente'::varchar(50),
      total_records
    FROM aggregated_data ad
    ORDER BY ad.total_sales DESC, ad.total_revenue DESC
    LIMIT limit_count OFFSET offset_count;

  ELSE -- superintendente
    SELECT COUNT(DISTINCT superintendente) INTO total_records
    FROM users 
    WHERE superintendente IS NOT NULL AND superintendente != '';
    
    RETURN QUERY
    WITH super_data AS (
      SELECT DISTINCT superintendente FROM users WHERE superintendente IS NOT NULL AND superintendente != ''
    ),
    aggregated_data AS (
      SELECT 
        sd.superintendente,
        COALESCE(SUM(sales_data.sales_count), 0)::bigint as total_sales,
        COALESCE(SUM(sales_data.revenue), 0) as total_revenue,
        COALESCE(SUM(visits_data.visits_count), 0)::bigint as total_visits,
        COALESCE(SUM(sales_data.contracts_count), 0)::bigint as total_contracts
      FROM super_data sd
      LEFT JOIN users u ON sd.superintendente = u.superintendente
      LEFT JOIN (
        SELECT 
          corretor_cpf,
          COUNT(CASE WHEN status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as sales_count,
          COALESCE(SUM(CASE WHEN status IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN sinal ELSE 0 END), 0) as revenue,
          COUNT(CASE WHEN status NOT IN ('VENDA - SV - VALIDADO DIRETO/NR (SV)', 'VENDA - SV - VALIDADO CEF (SV)') THEN 1 END) as contracts_count
        FROM sales 
        GROUP BY corretor_cpf
      ) sales_data ON u.cpf = sales_data.corretor_cpf
      LEFT JOIN (
        SELECT 
          u2.id,
          COUNT(v.id) as visits_count
        FROM users u2
        LEFT JOIN visits v ON u2.id = v.corretor_id 
          AND DATE_TRUNC('month', v.horario_entrada) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY u2.id
      ) visits_data ON u.id = visits_data.id
      GROUP BY sd.superintendente
    )
    SELECT 
      NULL::uuid,
      ad.superintendente::varchar(100),
      ad.superintendente::varchar(100),
      ad.total_sales,
      ad.total_revenue,
      ad.total_visits,
      ad.total_contracts,
      NULL::text,
      'superintendente'::varchar(50),
      total_records
    FROM aggregated_data ad
    ORDER BY ad.total_sales DESC, ad.total_revenue DESC
    LIMIT limit_count OFFSET offset_count;
  END IF;
END;
$function$;