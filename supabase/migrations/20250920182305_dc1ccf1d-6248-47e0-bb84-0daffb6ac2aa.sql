-- Ajuste de RLS: permitir que gerentes/superintendentes vejam comprovantes da equipe
-- A política antiga comparava users.id com invoice_uploads.user_id (auth uid), o que não confere.
-- Agora mapeamos via profiles (id = auth uid, cpf) -> users (cpf) para ambos gerente e colaborador.

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Managers can view team invoices" ON public.invoice_uploads;

-- Criar política corrigida
CREATE POLICY "Managers can view team invoices (via profiles)"
ON public.invoice_uploads
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p_manager
    JOIN public.users u_manager ON u_manager.cpf = p_manager.cpf
    JOIN public.profiles p_collab ON p_collab.id = invoice_uploads.user_id
    JOIN public.users u_collab ON u_collab.cpf = p_collab.cpf
    WHERE p_manager.id = auth.uid()
      AND u_manager.role IN ('gerente','superintendente')
      AND (
        (u_manager.gerente IS NOT NULL AND u_manager.gerente = u_collab.gerente)
        OR
        (u_manager.superintendente IS NOT NULL AND u_manager.superintendente = u_collab.superintendente)
      )
  )
);
