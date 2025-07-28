import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X, File } from 'lucide-react';

export const InvoiceUpload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: "Por favor, selecione um arquivo PDF, JPG ou PNG.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Criar preview para imagens
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      setUploading(true);
      setProgress(0);

      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Nome único para o arquivo
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload para o storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Obter URL do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('invoices')
        .getPublicUrl(fileName);

      // Salvar na tabela
      const { error: dbError } = await supabase
        .from('invoice_uploads')
        .insert({
          user_id: user.id,
          file_name: selectedFile.name,
          file_url: publicUrl,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
        });

      if (dbError) throw dbError;

      clearInterval(progressInterval);
      setProgress(100);

      toast({
        title: "Upload realizado com sucesso!",
        description: "Sua nota fiscal foi enviada e salva.",
      });

      clearSelection();
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-red-600" />
          <span>Anexar Nota Fiscal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Clique para selecionar um arquivo</p>
            <p className="text-sm text-gray-500">
              PDF, JPG ou PNG até 10MB
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                  <File className="w-8 h-8 text-red-600" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedFile.type === 'application/pdf' ? 'Documento PDF' : 'Imagem'}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              Enviando arquivo... {progress}%
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1"
            disabled={uploading}
          >
            <FileText className="w-4 h-4 mr-2" />
            {selectedFile ? 'Trocar Arquivo' : 'Selecionar Arquivo'}
          </Button>
          
          {selectedFile && (
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Enviando...' : 'Enviar'}
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Formatos aceitos: PDF, JPG, PNG</p>
          <p>• Tamanho máximo: 10MB</p>
          <p>• Esta nota será usada para fins administrativos</p>
        </div>
      </CardContent>
    </Card>
  );
};