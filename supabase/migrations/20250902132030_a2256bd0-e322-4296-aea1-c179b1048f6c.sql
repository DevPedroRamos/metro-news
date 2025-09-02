-- Add default value to created_at column and backfill NULL values
ALTER TABLE public.premiacao 
ALTER COLUMN created_at SET DEFAULT now();

-- Update existing NULL created_at values to current timestamp
UPDATE public.premiacao 
SET created_at = now() 
WHERE created_at IS NULL;

-- Add NOT NULL constraint
ALTER TABLE public.premiacao 
ALTER COLUMN created_at SET NOT NULL;

-- Add index for better performance on queries
CREATE INDEX IF NOT EXISTS idx_premiacao_created_at_premiado 
ON public.premiacao (created_at, premiado);