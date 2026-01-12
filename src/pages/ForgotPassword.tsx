import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateEmailDomain, resetPassword } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("E-mail inválido")
    .refine(validateEmailDomain, "E-mail deve ser do domínio @metrocasa.com.br ou @vendasmetrocasa.com.br"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);

    try {
      const { error } = await resetPassword(data.email);

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao enviar email",
          description: error.message,
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-900 via-red-800 to-red-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-red-900/30" />
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 tracking-wider">PORTAL METROCASA</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Recupere sua
              <br />
              <span className="text-red-300">Senha</span>
            </h2>
            <p className="text-xl text-red-100 leading-relaxed max-w-md">
              Não se preocupe, enviaremos um link para você redefinir sua senha de forma segura.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-red-800 mb-2">PORTAL METROCASA</h1>
            <p className="text-gray-600">Recupere sua senha</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-800">
                Esqueceu sua senha?
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Digite seu email para receber o link de redefinição
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {emailSent ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">Email enviado!</h3>
                    <p className="text-gray-600 text-sm">
                      Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para o login
                  </Link>
                </div>
              ) : (
                <>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        E-mail corporativo
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu.email@metrocasa.com.br"
                          className="pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500/20 transition-all duration-200"
                          {...form.register("email")}
                        />
                      </div>
                      {form.formState.errors.email && (
                        <Alert variant="destructive" className="py-2">
                          <AlertDescription className="text-sm">
                            {form.formState.errors.email.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        "Enviar link de redefinição"
                      )}
                    </Button>
                  </form>

                  <div className="text-center pt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar para o login
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
