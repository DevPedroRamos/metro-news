-- Corrigir ID do perfil para o usuário autenticado
-- Criar novo perfil com o ID correto do usuário autenticado
INSERT INTO profiles (id, cpf, name, role, avatar_url, cover_url, created_at)
SELECT 
  '3df25ac3-e2f7-4486-a7ee-dff9e3a7c6f9'::uuid,
  cpf,
  name, 
  role,
  avatar_url,
  cover_url,
  now()
FROM profiles 
WHERE cpf = '45948584810' AND id = 'ad3d4560-8948-4368-85cc-b97990327173';

-- Remover o perfil com ID incorreto
DELETE FROM profiles 
WHERE cpf = '45948584810' AND id = 'ad3d4560-8948-4368-85cc-b97990327173';