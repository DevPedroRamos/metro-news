-- Create metas table
CREATE TABLE public.metas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title character varying(255) NOT NULL,
  quantidade integer NOT NULL DEFAULT 0,
  role character varying(50) NOT NULL,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Todos podem ver metas ativas" 
ON public.metas 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins podem gerenciar metas" 
ON public.metas 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes
CREATE INDEX idx_metas_active ON public.metas(is_active);
CREATE INDEX idx_metas_featured ON public.metas(is_featured);
CREATE INDEX idx_metas_display_order ON public.metas(display_order);
CREATE INDEX idx_metas_role ON public.metas(role);

-- Create trigger for updated_at
CREATE TRIGGER update_metas_updated_at
  BEFORE UPDATE ON public.metas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();