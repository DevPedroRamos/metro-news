-- Fix get_champions_ranking function to return correct types and map name to users.apelido
CREATE OR REPLACE FUNCTION public.get_champions_ranking(ranking_type text DEFAULT 'corretor'::text, limit_count integer DEFAULT 50, offset_count integer DEFAULT 0)
 RETURNS TABLE(user_id uuid, name character varying(100), nickname character varying(100), sales_count bigint, revenue numeric, visits_count bigint, contracts_count bigint, avatar_url text, role character varying(50), total_count bigint)
 LANGUAGE plpgsql
AS $function$
DECLARE
  current_month_start DATE := DATE_TRUNC('month', CURRENT_DATE);
  current_month_end DATE := DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day';
  total_records BIGINT;
BEGIN
  -- Get total count first
  IF ranking_type = 'corretor' THEN
    SELECT COUNT(DISTINCT u.id) INTO total_records
    FROM users u 
    WHERE u.role = 'corretor';
  ELSIF ranking_type = 'gerente' THEN
    SELECT COUNT(DISTINCT u.gerente) INTO total_records
    FROM users u 
    WHERE u.gerente IS NOT NULL AND u.gerente != '';
  ELSE
    SELECT COUNT(DISTINCT u.superintendente) INTO total_records
    FROM users u 
    WHERE u.superintendente IS NOT NULL AND u.superintendente != '';
  END IF;

  -- Return paginated results based on ranking type
  IF ranking_type = 'corretor' THEN
    RETURN QUERY
    SELECT 
      u.id as user_id,
      u.apelido as name,  -- Changed from u.name to u.apelido
      u.apelido as nickname,
      COALESCE(sales_data.sales_count, 0) as sales_count,
      COALESCE(sales_data.revenue, 0) as revenue,
      COALESCE(visits_data.visits_count, 0) as visits_count,
      COALESCE(sales_data.contracts_count, 0) as contracts_count,
      p.avatar_url,
      u.role,
      total_records as total_count
    FROM users u
    LEFT JOIN profiles p ON u.id = p.id
    LEFT JOIN (
      SELECT 
        corretor_cpf,
        COUNT(*) as sales_count,
        SUM(sinal) as revenue,
        COUNT(CASE WHEN status = 'contrato' THEN 1 END) as contracts_count
      FROM sales 
      WHERE venda_data >= current_month_start 
        AND venda_data <= current_month_end
        AND status IN ('validado', 'contrato')
      GROUP BY corretor_cpf
    ) sales_data ON u.cpf = sales_data.corretor_cpf
    LEFT JOIN (
      SELECT 
        corretor_id,
        COUNT(*) as visits_count
      FROM visits 
      WHERE horario_entrada >= current_month_start 
        AND horario_entrada <= current_month_end
      GROUP BY corretor_id
    ) visits_data ON u.id = visits_data.corretor_id
    WHERE u.role = 'corretor'
    ORDER BY sales_count DESC, revenue DESC
    LIMIT limit_count OFFSET offset_count;

  ELSIF ranking_type = 'gerente' THEN
    RETURN QUERY
    SELECT 
      NULL::UUID as user_id,
      gerente_info.gerente::VARCHAR(100) as name,  -- Added explicit cast
      gerente_info.gerente::VARCHAR(100) as nickname,  -- Added explicit cast
      COALESCE(SUM(sales_data.sales_count), 0) as sales_count,
      COALESCE(SUM(sales_data.revenue), 0) as revenue,
      COALESCE(SUM(visits_data.visits_count), 0) as visits_count,
      COALESCE(SUM(sales_data.contracts_count), 0) as contracts_count,
      NULL::TEXT as avatar_url,
      'gerente'::VARCHAR(50) as role,  -- Added explicit cast
      total_records as total_count
    FROM (
      SELECT DISTINCT gerente FROM users WHERE gerente IS NOT NULL AND gerente != ''
    ) gerente_info
    LEFT JOIN users u ON gerente_info.gerente = u.gerente
    LEFT JOIN (
      SELECT 
        corretor_cpf,
        COUNT(*) as sales_count,
        SUM(sinal) as revenue,
        COUNT(CASE WHEN status = 'contrato' THEN 1 END) as contracts_count
      FROM sales 
      WHERE venda_data >= current_month_start 
        AND venda_data <= current_month_end
        AND status IN ('validado', 'contrato')
      GROUP BY corretor_cpf
    ) sales_data ON u.cpf = sales_data.corretor_cpf
    LEFT JOIN (
      SELECT 
        corretor_id,
        COUNT(*) as visits_count
      FROM visits 
      WHERE horario_entrada >= current_month_start 
        AND horario_entrada <= current_month_end
      GROUP BY corretor_id
    ) visits_data ON u.id = visits_data.corretor_id
    GROUP BY gerente_info.gerente
    ORDER BY sales_count DESC, revenue DESC
    LIMIT limit_count OFFSET offset_count;

  ELSE -- superintendente
    RETURN QUERY
    SELECT 
      NULL::UUID as user_id,
      super_info.superintendente::VARCHAR(100) as name,  -- Added explicit cast
      super_info.superintendente::VARCHAR(100) as nickname,  -- Added explicit cast
      COALESCE(SUM(sales_data.sales_count), 0) as sales_count,
      COALESCE(SUM(sales_data.revenue), 0) as revenue,
      COALESCE(SUM(visits_data.visits_count), 0) as visits_count,
      COALESCE(SUM(sales_data.contracts_count), 0) as contracts_count,
      NULL::TEXT as avatar_url,
      'superintendente'::VARCHAR(50) as role,  -- Added explicit cast
      total_records as total_count
    FROM (
      SELECT DISTINCT superintendente FROM users WHERE superintendente IS NOT NULL AND superintendente != ''
    ) super_info
    LEFT JOIN users u ON super_info.superintendente = u.superintendente
    LEFT JOIN (
      SELECT 
        corretor_cpf,
        COUNT(*) as sales_count,
        SUM(sinal) as revenue,
        COUNT(CASE WHEN status = 'contrato' THEN 1 END) as contracts_count
      FROM sales 
      WHERE venda_data >= current_month_start 
        AND venda_data <= current_month_end
        AND status IN ('validado', 'contrato')
      GROUP BY corretor_cpf
    ) sales_data ON u.cpf = sales_data.corretor_cpf
    LEFT JOIN (
      SELECT 
        corretor_id,
        COUNT(*) as visits_count
      FROM visits 
      WHERE horario_entrada >= current_month_start 
        AND horario_entrada <= current_month_end
      GROUP BY corretor_id
    ) visits_data ON u.id = visits_data.corretor_id
    GROUP BY super_info.superintendente
    ORDER BY sales_count DESC, revenue DESC
    LIMIT limit_count OFFSET offset_count;
  END IF;
END;
$function$