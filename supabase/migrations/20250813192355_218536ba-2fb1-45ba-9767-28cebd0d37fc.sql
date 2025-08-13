-- Criar tabela de categorias de notícias
CREATE TABLE public.news_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Cor hex para a categoria
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de notícias/artigos
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category_id UUID NOT NULL REFERENCES public.news_categories(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  author_name VARCHAR(100) NOT NULL, -- Duplicado para performance
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER NOT NULL DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 5,
  meta_title VARCHAR(60), -- SEO
  meta_description VARCHAR(160), -- SEO
  tags TEXT[], -- Array de tags
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

-- Políticas para categorias de notícias
-- Todos podem ver categorias ativas
CREATE POLICY "Todos podem ver categorias ativas" 
ON public.news_categories 
FOR SELECT 
USING (is_active = true);

-- Admins e redatores podem ver todas as categorias
CREATE POLICY "Redatores podem ver todas as categorias" 
ON public.news_categories 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role)
);

-- Admins podem gerenciar categorias
CREATE POLICY "Admins podem gerenciar categorias" 
ON public.news_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para artigos de notícias
-- Todos podem ver artigos publicados
CREATE POLICY "Todos podem ver artigos publicados" 
ON public.news_articles 
FOR SELECT 
USING (is_published = true);

-- Redatores podem ver seus próprios artigos
CREATE POLICY "Redatores podem ver seus próprios artigos" 
ON public.news_articles 
FOR SELECT 
USING (
  auth.uid() = author_id AND (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role)
  )
);

-- Admins podem ver todos os artigos
CREATE POLICY "Admins podem ver todos os artigos" 
ON public.news_articles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Redatores podem criar artigos
CREATE POLICY "Redatores podem criar artigos" 
ON public.news_articles 
FOR INSERT 
WITH CHECK (
  auth.uid() = author_id AND (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role)
  )
);

-- Redatores podem atualizar seus próprios artigos
CREATE POLICY "Redatores podem atualizar seus próprios artigos" 
ON public.news_articles 
FOR UPDATE 
USING (
  auth.uid() = author_id AND (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'editor'::app_role)
  )
);

-- Admins podem atualizar qualquer artigo
CREATE POLICY "Admins podem atualizar qualquer artigo" 
ON public.news_articles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Política especial para atualizar view_count (todos podem)
CREATE POLICY "Todos podem atualizar view_count" 
ON public.news_articles 
FOR UPDATE 
USING (true);

-- Admins podem deletar artigos
CREATE POLICY "Admins podem deletar artigos" 
ON public.news_articles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_news_categories_updated_at
    BEFORE UPDATE ON public.news_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at
    BEFORE UPDATE ON public.news_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para definir published_at quando is_published for true
CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Se o artigo está sendo publicado pela primeira vez
    IF NEW.is_published = true AND (OLD.is_published = false OR OLD.published_at IS NULL) THEN
        NEW.published_at = now();
    -- Se o artigo está sendo despublicado
    ELSIF NEW.is_published = false THEN
        NEW.published_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_news_articles_published_at
    BEFORE UPDATE ON public.news_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_published_at();

-- Função para incrementar view_count
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.news_articles 
    SET view_count = view_count + 1 
    WHERE id = article_id AND is_published = true;
END;
$$;

-- Adicionar o role de editor se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
    ELSE
        -- Adicionar 'editor' ao enum existente se não estiver presente
        BEGIN
            ALTER TYPE public.app_role ADD VALUE 'editor';
        EXCEPTION
            WHEN duplicate_object THEN NULL; -- Ignorar se já existir
        END;
    END IF;
END $$;

-- Inserir categorias padrão
INSERT INTO public.news_categories (name, slug, description, color, display_order) VALUES
('Minha Casa Minha Vida', 'minha-casa-minha-vida', 'Notícias sobre o programa habitacional', '#10B981', 1),
('Decoração', 'decoracao', 'Dicas e tendências de decoração', '#F59E0B', 2),
('Empreendimentos', 'empreendimentos', 'Lançamentos e novidades de empreendimentos', '#3B82F6', 3),
('Mercado Imobiliário', 'mercado-imobiliario', 'Análises e tendências do mercado', '#8B5CF6', 4),
('Financiamento', 'financiamento', 'Informações sobre financiamentos e crédito', '#EF4444', 5),
('Documentação', 'documentacao', 'Guias sobre documentação imobiliária', '#6B7280', 6),
('Investimentos', 'investimentos', 'Dicas de investimento imobiliário', '#059669', 7);

-- Criar índices para performance
CREATE INDEX idx_news_articles_published ON public.news_articles(is_published, published_at DESC) WHERE is_published = true;
CREATE INDEX idx_news_articles_category ON public.news_articles(category_id);
CREATE INDEX idx_news_articles_author ON public.news_articles(author_id);
CREATE INDEX idx_news_articles_featured ON public.news_articles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_news_articles_slug ON public.news_articles(slug);
CREATE INDEX idx_news_categories_active ON public.news_categories(is_active, display_order) WHERE is_active = true;