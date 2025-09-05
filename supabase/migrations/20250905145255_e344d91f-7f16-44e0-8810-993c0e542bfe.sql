
-- 1) Adiciona coluna periodo_id na tabela public.resume
ALTER TABLE public.resume
ADD COLUMN IF NOT EXISTS periodo_id bigint;

-- 2) Índice composto para acelerar consultas por (cpf, periodo_id)
CREATE INDEX IF NOT EXISTS resume_cpf_periodo_id_idx
  ON public.resume (cpf, periodo_id);

-- 3) FK para payments.periodo(id)
ALTER TABLE public.resume
ADD CONSTRAINT IF NOT EXISTS resume_periodo_id_fkey
FOREIGN KEY (periodo_id)
REFERENCES payments.periodo(id)
ON UPDATE CASCADE
ON DELETE SET NULL;

-- 4) Backfill: preenche periodo_id com base no intervalo do período
-- Considera created_at::date dentro de [start, end]
UPDATE public.resume r
SET periodo_id = p.id
FROM payments.periodo p
WHERE r.periodo_id IS NULL
  AND r.created_at IS NOT NULL
  AND r.created_at::date BETWEEN p.start AND p."end";
