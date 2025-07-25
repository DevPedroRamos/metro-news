-- Corrigir dados duplicados no profiles e garantir consistência
-- Primeiro, vamos mover as imagens do perfil com imagens para o perfil correto
UPDATE profiles 
SET avatar_url = (
  SELECT avatar_url FROM profiles 
  WHERE cpf = '45948584810' AND avatar_url IS NOT NULL 
  LIMIT 1
),
cover_url = (
  SELECT cover_url FROM profiles 
  WHERE cpf = '45948584810' AND cover_url IS NOT NULL 
  LIMIT 1
)
WHERE cpf = '45948584810' AND id = 'ad3d4560-8948-4368-85cc-b97990327173';

-- Remover o perfil duplicado (mantendo apenas o que tem o ID correto do usuário)
DELETE FROM profiles 
WHERE cpf = '45948584810' AND id != 'ad3d4560-8948-4368-85cc-b97990327173';