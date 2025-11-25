import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Upload, X, UserCircle } from 'lucide-react';

interface ProfilePhotoPromptProps {
  onImageUpdate: (url: string) => Promise<void>;
}

const ProfilePhotoPrompt: React.FC<ProfilePhotoPromptProps> = ({ onImageUpdate }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo de imagem válido.",
        variant: "destructive",
      });
      return;
    }

    // Validação de tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    try {
      setUploading(true);
      setUploadProgress(10);

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(60);

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      setUploadProgress(80);

      await onImageUpdate(publicUrl);

      setUploadProgress(100);

      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso.",
      });

      clearPreview();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
            <UserCircle className="h-12 w-12 text-blue-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Adicione uma foto de perfil profissional.
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-2">
            Uma foto de perfil ajuda sua equipe a te reconhecer e transmite profissionalismo.
          </p>
        </DialogHeader>

          <div className="space-y-4">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearPreview}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">
                  Clique para selecionar uma imagem
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG ou WEBP (máx. 5MB)
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />

            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-xs text-center text-gray-500">
                  Fazendo upload... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              clearPreview();
              setIsOpen(false);
            }}
            disabled={uploading}
          >
            Depois
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!preview || uploading}
          >
            {uploading ? 'Enviando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePhotoPrompt;
