-- Migration: Adicionar colunas de gerente e superintendente na tabela payments.saldo_cef

-- Primeiro, dropar a view
DROP VIEW IF EXISTS public.saldo_cef;

-- Adicionar colunas do GERENTE na tabela payments.saldo_cef
ALTER TABLE payments.saldo_cef
ADD COLUMN IF NOT EXISTS gerente_comissao_sinal_perc numeric,
ADD COLUMN IF NOT EXISTS gerente_comissao_vgv_perc numeric,
ADD COLUMN IF NOT EXISTS gerente_comissao_extra_perc numeric,
ADD COLUMN IF NOT EXISTS gerente_comissao_sinal_valor numeric,
ADD COLUMN IF NOT EXISTS gerente_comissao_vgv_valor numeric,
ADD COLUMN IF NOT EXISTS gerente_premio_repasse_fiador_valor numeric,
ADD COLUMN IF NOT EXISTS gerente_vgv_valor numeric;

-- Adicionar colunas do SUPERINTENDENTE
ALTER TABLE payments.saldo_cef
ADD COLUMN IF NOT EXISTS superintendente_comissao_sinal_perc numeric,
ADD COLUMN IF NOT EXISTS superintendente_comissao_vgv_perc numeric,
ADD COLUMN IF NOT EXISTS superintendente_comissao_extra_perc numeric,
ADD COLUMN IF NOT EXISTS superintendente_comissao_sinal_valor numeric,
ADD COLUMN IF NOT EXISTS superintendente_comissao_vgv_valor numeric,
ADD COLUMN IF NOT EXISTS superintendente_premio_repasse_fiador_valor numeric,
ADD COLUMN IF NOT EXISTS superintendente_vgv_valor numeric;

-- Recriar a view com todas as colunas
CREATE VIEW public.saldo_cef AS
SELECT 
  id,
  cliente,
  empreendimento,
  bl,
  unid,
  vendedor_parceiro,
  supervisor_coord_parceiro,
  gerente,
  superintendente,
  gestor,
  comissao_sinal_perc,
  comissao_vgv_perc,
  comissao_extra_perc,
  comissao_sinal_valor,
  comissao_vgv_valor,
  premio_repasse_fiador_valor,
  vendedor_vgv_valor,
  vendedor_premio_repasse_fiador_valor,
  gerente_comissao_sinal_perc,
  gerente_comissao_vgv_perc,
  gerente_comissao_extra_perc,
  gerente_comissao_sinal_valor,
  gerente_comissao_vgv_valor,
  gerente_premio_repasse_fiador_valor,
  gerente_vgv_valor,
  superintendente_comissao_sinal_perc,
  superintendente_comissao_vgv_perc,
  superintendente_comissao_extra_perc,
  superintendente_comissao_sinal_valor,
  superintendente_comissao_vgv_valor,
  superintendente_premio_repasse_fiador_valor,
  superintendente_vgv_valor,
  subtotal,
  total,
  created_at,
  periodo_id
FROM payments.saldo_cef;

-- Comentários para documentação
COMMENT ON COLUMN payments.saldo_cef.gerente_comissao_sinal_perc IS 'Percentual de comissão do sinal para o gerente';
COMMENT ON COLUMN payments.saldo_cef.gerente_vgv_valor IS 'Valor VGV do gerente';
COMMENT ON COLUMN payments.saldo_cef.superintendente_comissao_sinal_perc IS 'Percentual de comissão do sinal para o superintendente';
COMMENT ON COLUMN payments.saldo_cef.superintendente_vgv_valor IS 'Valor VGV do superintendente';