import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentPeriod } from '@/hooks/useCurrentPeriod';
import { useProfileUsers } from '@/hooks/useProfileUsers';

interface InvoiceUpload {
  id: string;
  user_id: string;
  periodo_id: number | null;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface UseInvoiceUploadsReturn {
  currentInvoice: InvoiceUpload | null;
  allInvoices: InvoiceUpload[];
  loading: boolean;
  error: string | null;
  uploadInvoice: (file: File) => Promise<boolean>;
  deleteInvoice: (id: string) => Promise<boolean>;
  downloadInvoice: (invoice: InvoiceUpload) => Promise<void>;
  refetch: () => void;
}

export const useInvoiceUploads = (): UseInvoiceUploadsReturn => {
  const { user } = useAuth();
  const { period } = useCurrentPeriod();
  const { userData } = useProfileUsers();
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceUpload | null>(null);
  const [allInvoices, setAllInvoices] = useState<InvoiceUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Buscar comprovante do período atual
      if (period?.id) {
        const { data: currentData, error: currentError } = await supabase
          .from('invoice_uploads')
          .select('*')
          .eq('user_id', user.id)
          .eq('periodo_id', period.id)
          .maybeSingle();

        if (currentError) throw currentError;
        setCurrentInvoice(currentData);
      }

      // Buscar todos os comprovantes do usuário
      const { data: allData, error: allError } = await supabase
        .from('invoice_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (allError) throw allError;
      setAllInvoices(allData || []);
    } catch (err) {
      console.error('Erro ao buscar comprovantes:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const uploadInvoice = async (file: File): Promise<boolean> => {
    if (!user?.id || !period?.id) {
      setError('Usuário ou período não encontrado');
      return false;
    }

    if (!userData?.name) {
      setError('Nome do usuário não encontrado');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Extrair a extensão do arquivo original
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      
      // Criar nome do arquivo com o nome completo do usuário + extensão
      const userFileName = `${userData.name}${fileExtension}`;

      // Upload do arquivo para o storage
      const fileName = `${user.id}/${period.id}_${Date.now()}_${userFileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('invoices')
        .getPublicUrl(fileName);

      // Inserir registro no banco (ou atualizar se já existe)
      if (currentInvoice) {
        // Atualizar registro existente
        const { error: updateError } = await supabase
          .from('invoice_uploads')
          .update({
            file_name: userFileName,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size,
          })
          .eq('id', currentInvoice.id);

        if (updateError) throw updateError;
      } else {
        // Criar novo registro
        const { error: insertError } = await supabase
          .from('invoice_uploads')
          .insert({
            user_id: user.id,
            periodo_id: period.id,
            file_name: userFileName,
            file_url: publicUrl,
            file_type: file.type,
            file_size: file.size,
          });

        if (insertError) throw insertError;
      }

      await fetchInvoices();
      return true;
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('invoice_uploads')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchInvoices();
      return true;
    } catch (err) {
      console.error('Erro ao deletar comprovante:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (invoice: InvoiceUpload): Promise<void> => {
    try {
      // Extrair o path do arquivo da URL para usar com storage.download
      const url = new URL(invoice.file_url);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'invoices');
      
      if (bucketIndex === -1) {
        throw new Error('Caminho do arquivo inválido');
      }
      
      const filePath = pathParts.slice(bucketIndex + 1).join('/');
      
      // Usar API do Supabase Storage para download seguro
      const { data, error } = await supabase.storage
        .from('invoices')
        .download(filePath);

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Arquivo não encontrado');
      }

      // Criar URL para download
      const downloadUrl = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = invoice.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Erro ao baixar arquivo:', err);
      setError('Erro ao baixar arquivo');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user?.id, period?.id]);

  return {
    currentInvoice,
    allInvoices,
    loading,
    error,
    uploadInvoice,
    deleteInvoice,
    downloadInvoice,
    refetch: fetchInvoices,
  };
};