import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, FileText, CheckCircle, Download } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useInvoiceUploads } from "@/hooks/useInvoiceUploads";
import { useCurrentPeriod } from "@/hooks/useCurrentPeriod";

export function InvoiceUpload() {
  const { toast } = useToast();
  const { period } = useCurrentPeriod();
  const { 
    currentInvoice, 
    loading, 
    error, 
    uploadInvoice, 
    deleteInvoice, 
    downloadInvoice 
  } = useInvoiceUploads();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

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
        description: "O arquivo deve ter no máximo 20MB.",
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
    if (!selectedFile) return;

    try {
      setUploading(true);
      setProgress(0);
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const success = await uploadInvoice(selectedFile);

      clearInterval(progressInterval);
      setProgress(100);
      
      if (success) {
        toast({
          title: "Upload concluído!",
          description: "Seu comprovante foi enviado com sucesso.",
        });
        clearSelection();
      } else {
        throw new Error(error || "Erro no upload");
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!currentInvoice) return;

    try {
      const success = await deleteInvoice(currentInvoice.id);
      if (success) {
        toast({
          title: "Comprovante removido",
          description: "O comprovante foi removido com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o comprovante.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async () => {
    if (!currentInvoice) return;
    await downloadInvoice(currentInvoice);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Enviar Nota Fiscal de prestação de serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Enviar nota fiscal de prestação de serviço
          {period && (
            <span className="text-sm font-normal text-muted-foreground">
              - Período: {period.start} à {period.end}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status do comprovante atual */}
        {currentInvoice ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Comprovante enviado</p>
                  <p className="text-sm text-green-700">{currentInvoice.file_name}</p>
                  <p className="text-xs text-green-600">
                    Enviado em {new Date(currentInvoice.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Área de upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                preview ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="space-y-4">
                  {selectedFile?.type === "application/pdf" ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-16 w-16 text-red-500" />
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-32 mx-auto rounded-lg shadow-md"
                      />
                      <p className="font-medium">{selectedFile?.name}</p>
                      <p className="text-sm text-gray-500">
                        {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 text-gray-400">
                    <Upload className="w-full h-full" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Clique para selecionar arquivo</p>
                    <p className="text-sm text-gray-500">
                      ou arraste e solte aqui
                    </p>
                  </div>
                  <div className="text-xs text-gray-400">
                    <p>Formatos aceitos: PDF, JPG, PNG</p>
                    <p>Tamanho máximo: 20MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Barra de progresso */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Enviando...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                {selectedFile ? 'Alterar Arquivo' : 'Selecionar Arquivo'}
              </Button>
              
              {selectedFile && !uploading && (
                <Button onClick={handleUpload} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}