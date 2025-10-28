-- Primeiro, remover a view que depende das colunas
DROP VIEW IF EXISTS public.base_de_vendas;

-- Alterar precisão das colunas de porcentagem (corretor)
ALTER TABLE payments."base-de-vendas" 
  ALTER COLUMN comissao_sinal_perc TYPE NUMERIC(7,4),
  ALTER COLUMN comissao_vgv_pre_chaves_perc TYPE NUMERIC(7,4),
  ALTER COLUMN comissao_extra_perc TYPE NUMERIC(7,4);

-- Alterar precisão das colunas de porcentagem (gerente)
ALTER TABLE payments."base-de-vendas" 
  ALTER COLUMN comissao_sinal_perc_gerente TYPE NUMERIC(7,4),
  ALTER COLUMN comissao_vgv_pre_chaves_perc_gerente TYPE NUMERIC(7,4),
  ALTER COLUMN comissao_extra_perc_gerente TYPE NUMERIC(7,4);

-- Alterar precisão das colunas de porcentagem (superintendente)
ALTER TABLE payments."base-de-vendas" 
  ALTER COLUMN comissao_sinal_perc_superintendente TYPE NUMERIC(7,4),
  ALTER COLUMN comissao_vgv_pre_chaves_perc_superintendente TYPE NUMERIC(7,4),
  ALTER COLUMN comissao_extra_perc_superintendente TYPE NUMERIC(7,4);

-- Alterar outras colunas de porcentagem
ALTER TABLE payments."base-de-vendas" 
  ALTER COLUMN perc_desconto TYPE NUMERIC(7,4),
  ALTER COLUMN perc_sinal_recebido TYPE NUMERIC(7,4);

-- Recriar a view com as colunas atualizadas
CREATE OR REPLACE VIEW public.base_de_vendas AS 
SELECT * FROM payments."base-de-vendas";