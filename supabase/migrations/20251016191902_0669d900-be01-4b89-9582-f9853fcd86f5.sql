-- Criar políticas RLS para gerentes e superintendentes verem agendamentos da equipe

-- Política para gerentes verem agendamentos da equipe
CREATE POLICY "Gerentes podem ver agendamentos da equipe"
ON public.agendamentos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p_manager
    JOIN users u_manager ON u_manager.cpf = p_manager.cpf
    JOIN users u_corretor ON u_corretor.cpf = agendamentos.corretor_cpf
    WHERE p_manager.id = auth.uid()
    AND u_manager.role = 'gerente'
    AND u_corretor.gerente = u_manager.apelido
  )
);

-- Política para superintendentes verem agendamentos da superintendência
CREATE POLICY "Superintendentes podem ver agendamentos da superintendencia"
ON public.agendamentos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p_super
    JOIN users u_super ON u_super.cpf = p_super.cpf
    JOIN users u_corretor ON u_corretor.cpf = agendamentos.corretor_cpf
    WHERE p_super.id = auth.uid()
    AND u_super.role = 'superintendente'
    AND u_corretor.superintendente = u_super.apelido
  )
);

-- Política para gerentes atualizarem agendamentos da equipe
CREATE POLICY "Gerentes podem atualizar agendamentos da equipe"
ON public.agendamentos
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p_manager
    JOIN users u_manager ON u_manager.cpf = p_manager.cpf
    JOIN users u_corretor ON u_corretor.cpf = agendamentos.corretor_cpf
    WHERE p_manager.id = auth.uid()
    AND u_manager.role = 'gerente'
    AND u_corretor.gerente = u_manager.apelido
  )
);

-- Política para superintendentes atualizarem agendamentos da superintendência
CREATE POLICY "Superintendentes podem atualizar agendamentos da superintendencia"
ON public.agendamentos
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p_super
    JOIN users u_super ON u_super.cpf = p_super.cpf
    JOIN users u_corretor ON u_corretor.cpf = agendamentos.corretor_cpf
    WHERE p_super.id = auth.uid()
    AND u_super.role = 'superintendente'
    AND u_corretor.superintendente = u_super.apelido
  )
);