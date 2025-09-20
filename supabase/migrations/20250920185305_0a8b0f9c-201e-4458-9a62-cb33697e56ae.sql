-- Ensure the 'invoices' storage bucket exists and is private
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

-- Policies for secure access to 'invoices' bucket objects
-- 1) Allow users to read their own files (path prefix is their auth.uid())
DROP POLICY IF EXISTS "Invoices: users can read own files" ON storage.objects;
CREATE POLICY "Invoices: users can read own files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'invoices'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 2) Allow managers and superintendents to read files of their team members
DROP POLICY IF EXISTS "Invoices: managers can read team files" ON storage.objects;
CREATE POLICY "Invoices: managers can read team files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'invoices'
  AND EXISTS (
    SELECT 1
    FROM profiles p_manager
    JOIN users u_manager ON u_manager.cpf = p_manager.cpf
    JOIN profiles p_collab ON p_collab.id::text = (storage.foldername(storage.objects.name))[1]
    JOIN users u_collab ON u_collab.cpf = p_collab.cpf
    WHERE p_manager.id = auth.uid()
      AND u_manager.role IN ('gerente', 'superintendente')
      AND (
        (u_manager.gerente IS NOT NULL AND u_manager.gerente = u_collab.gerente)
        OR
        (u_manager.superintendente IS NOT NULL AND u_manager.superintendente = u_collab.superintendente)
      )
  )
);
