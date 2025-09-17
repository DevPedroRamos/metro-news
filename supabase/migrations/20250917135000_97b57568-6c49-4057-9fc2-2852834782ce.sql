-- Adicionar novos campos de comissão para gerente na tabela base_de_vendas
ALTER TABLE base_de_vendas 
ADD COLUMN comissao_sinal_perc_gerente NUMERIC,
ADD COLUMN comissao_vgv_pre_chaves_perc_gerente NUMERIC,
ADD COLUMN comissao_extra_perc_gerente NUMERIC,
ADD COLUMN comissao_integral_sinal_gerente NUMERIC,
ADD COLUMN comissao_integral_vgv_pre_chaves_gerente NUMERIC,
ADD COLUMN comissao_integral_extra_gerente NUMERIC,
ADD COLUMN sinal_comissao_extra_vendedor_gerente NUMERIC;

-- Adicionar novos campos de comissão para superintendente na tabela base_de_vendas
ALTER TABLE base_de_vendas 
ADD COLUMN comissao_sinal_perc_superintendente NUMERIC,
ADD COLUMN comissao_vgv_pre_chaves_perc_superintendente NUMERIC,
ADD COLUMN comissao_extra_perc_superintendente NUMERIC,
ADD COLUMN comissao_integral_sinal_superintendente NUMERIC,
ADD COLUMN comissao_integral_vgv_pre_chaves_superintendente NUMERIC,
ADD COLUMN comissao_integral_extra_superintendente NUMERIC,
ADD COLUMN sinal_comissao_extra_vendedor_superintendente NUMERIC;