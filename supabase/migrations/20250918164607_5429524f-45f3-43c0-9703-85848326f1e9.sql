-- Função para buscar histórico de pagamentos com as datas dos períodos
CREATE OR REPLACE FUNCTION public.get_payment_history(
  user_cpf TEXT,
  current_period_id BIGINT
)
RETURNS TABLE(
  id UUID,
  periodo_id BIGINT,
  period_start DATE,
  period_end DATE,
  valor_base NUMERIC,
  pagar NUMERIC,
  comissao NUMERIC,
  premio NUMERIC,
  saldo_cef NUMERIC,
  outras NUMERIC,
  adiantamento NUMERIC,
  antecipacao NUMERIC,
  distrato NUMERIC,
  outros NUMERIC,
  saldo_permuta NUMERIC,
  saldo_neg_periodos_anteriores NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.periodo_id,
    p.start as period_start,
    p."end" as period_end,
    r.valor_base,
    r.pagar,
    r.comissao,
    r.premio,
    r.saldo_cef,
    r.outras,
    r.adiantamento,
    r.antecipacao,
    r.distrato,
    r.outros,
    r.saldo_permuta,
    r.saldo_neg_periodos_anteriores,
    r.created_at
  FROM public.resume r
  JOIN payments.periodo p ON r.periodo_id = p.id
  WHERE r.cpf = user_cpf 
    AND r.periodo_id != current_period_id
  ORDER BY r.created_at DESC;
END;
$$;