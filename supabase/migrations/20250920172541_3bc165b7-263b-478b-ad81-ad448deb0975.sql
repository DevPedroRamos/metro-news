-- Criar bucket para invoices se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invoices', 
  'invoices', 
  false, 
  20971520, -- 20MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas para o bucket de invoices
CREATE POLICY "Users can upload their own invoices" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'invoices' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own invoices" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'invoices' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own invoices" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'invoices' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir gerentes e superintendentes verem comprovantes de sua equipe
CREATE POLICY "Managers can view team invoices" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'invoices' 
  AND EXISTS (
    SELECT 1 FROM public.users u1
    JOIN public.users u2 ON u1.gerente = u2.gerente OR u1.superintendente = u2.superintendente
    WHERE u1.id = auth.uid() 
    AND u2.id::text = (storage.foldername(name))[1]
    AND u1.role IN ('gerente', 'superintendente')
  )
);