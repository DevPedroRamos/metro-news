-- Criar política de UPDATE para a tabela uber
CREATE POLICY "Allow authenticated users to update uber" 
ON public.uber 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);