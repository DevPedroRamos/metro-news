
-- 1) Tabela de links úteis
CREATE TABLE IF NOT EXISTS public.useful_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(150) NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Habilitar RLS
ALTER TABLE public.useful_links ENABLE ROW LEVEL SECURITY;

-- 3) Políticas de acesso
-- Todos podem ver links ativos
CREATE POLICY "Todos podem ver links ativos"
  ON public.useful_links
  FOR SELECT
  USING (is_active = true);

-- Admins podem ver todos os links
CREATE POLICY "Admins podem ver todos os links"
  ON public.useful_links
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem inserir
CREATE POLICY "Admins podem inserir links"
  ON public.useful_links
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem atualizar
CREATE POLICY "Admins podem atualizar links"
  ON public.useful_links
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem deletar
CREATE POLICY "Admins podem deletar links"
  ON public.useful_links
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4) Trigger para updated_at
DROP TRIGGER IF EXISTS trg_useful_links_updated_at ON public.useful_links;
CREATE TRIGGER trg_useful_links_updated_at
BEFORE UPDATE ON public.useful_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Índices
CREATE INDEX IF NOT EXISTS idx_useful_links_active ON public.useful_links (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_useful_links_order ON public.useful_links (display_order);

-- 6) Seeds iniciais (3 links informados)
INSERT INTO public.useful_links (title, description, url, display_order)
VALUES
  ('Materiais', 'Todo material institucional que um consultor de vendas precisa', 'https://www.metrocasa.com.br/dashboard/materiais', 1),
  ('Fale conosco', 'Central de ajuda Metrocasa', 'https://faleconosco.metrocasa.com.br', 2),
  ('Indicação', 'Pagina de indicação para clientes Metrocasa', 'https://faleconosco.metrocasa.com.br/indicacao', 3)
ON CONFLICT DO NOTHING;
