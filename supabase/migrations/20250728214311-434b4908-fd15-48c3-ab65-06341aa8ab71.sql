-- Create table for invoice uploads
CREATE TABLE public.invoice_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.invoice_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create storage bucket for invoices if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for invoices
CREATE POLICY "Users can view their own invoices in storage" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'invoices' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own invoices" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'invoices' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own invoices" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'invoices' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own invoices" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'invoices' AND auth.uid()::text = (storage.foldername(name))[1]);