-- Adicionar coluna periodo_id na tabela invoice_uploads
ALTER TABLE public.invoice_uploads 
ADD COLUMN periodo_id bigint;

-- Criar índice para melhor performance
CREATE INDEX idx_invoice_uploads_periodo_id ON public.invoice_uploads(periodo_id);
CREATE INDEX idx_invoice_uploads_user_periodo ON public.invoice_uploads(user_id, periodo_id);

-- Adicionar constraint única para evitar múltiplos uploads por usuário/período
ALTER TABLE public.invoice_uploads 
ADD CONSTRAINT unique_user_periodo UNIQUE (user_id, periodo_id);

-- Atualizar RLS policies para incluir lógica de período
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoice_uploads;
DROP POLICY IF EXISTS "Users can upload their own invoices" ON public.invoice_uploads;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoice_uploads;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoice_uploads;

-- Políticas atualizadas
CREATE POLICY "Users can view their own invoices" 
ON public.invoice_uploads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own invoices" 
ON public.invoice_uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" 
ON public.invoice_uploads 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" 
ON public.invoice_uploads 
FOR DELETE 
USING (auth.uid() = user_id);

-- Permitir gerentes e superintendentes verem comprovantes de sua equipe
CREATE POLICY "Managers can view team invoices" 
ON public.invoice_uploads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users u1
    JOIN public.users u2 ON u1.gerente = u2.gerente OR u1.superintendente = u2.superintendente
    WHERE u1.id = auth.uid() 
    AND u2.id = invoice_uploads.user_id
    AND u1.role IN ('gerente', 'superintendente')
  )
);