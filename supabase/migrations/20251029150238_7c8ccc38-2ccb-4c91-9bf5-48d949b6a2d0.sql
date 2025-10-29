-- Tornar o bucket invoices público para permitir acesso via URLs públicas
UPDATE storage.buckets 
SET public = true 
WHERE id = 'invoices';