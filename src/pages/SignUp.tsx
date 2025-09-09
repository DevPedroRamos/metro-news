import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { validateEmailDomain, validateCPF, formatCPF, checkCPFExists, signUp, signIn } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const signUpSchema = z.object({
  email: z.string()
    .email('E-mail inválido')
    .refine(validateEmailDomain, 'E-mail deve ser do domínio @metrocasa.com.br'),
  cpf: z.string()
    .min(14, 'CPF é obrigatório')
    .refine((cpf) => validateCPF(cpf), 'CPF inválido'),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
});

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cpfStatus, setCpfStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      cpf: '',
      password: ''
    }
  });

  const password = form.watch('password');
  const cpf = form.watch('cpf');

  // Calculate password strength
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  // Handle CPF validation
  const handleCpfBlur = async () => {
    if (cpf && validateCPF(cpf)) {
      setCpfStatus('checking');
      const exists = await checkCPFExists(cpf);
      setCpfStatus(exists ? 'valid' : 'invalid');
    } else {
      setCpfStatus('idle');
    }
  };

  const onSubmit = async (data: SignUpForm) => {
    if (cpfStatus !== 'valid') {
      toast({
        variant: "destructive",
        title: "CPF não autorizado",
        description: "CPF não autorizado para cadastro"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: signUpData, error: signUpError } = await signUp(data.email, data.password, data.cpf);
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          toast({
            variant: "destructive",
            title: "Usuário já existe",
            description: "Este e-mail já está cadastrado"
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro no cadastro",
            description: signUpError.message
          });
        }
        return;
      }

      // Auto login after successful signup
      if (signUpData.user) {
        const { error: signInError } = await signIn(data.email, data.password);
        
        if (!signInError) {
          toast({
            title: "Conta criada com sucesso!",
            description: "Bem-vindo ao Metro News"
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes"
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
            <h1 className="text-4xl font-bold mb-2 tracking-wider">METROCASA</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Junte-se
              <br />
              <span className="text-red-300">à Equipe</span>
            </h2>
            <p className="text-xl text-red-100 leading-relaxed max-w-md">
              Crie sua conta corporativa e tenha acesso completo ao portal.
              <br />
              Seja bem-vindo ao futuro.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-red-800 mb-2">METRO</h1>
            <p className="text-gray-600">Portal Metro News</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-800">Criar Conta</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Preencha os dados para criar sua conta corporativa
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
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
                      {...form.register('email')}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-sm">{form.formState.errors.email.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-gray-700 font-medium">
                    CPF
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className="pl-10 pr-12 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500/20 transition-all duration-200"
                      {...form.register('cpf', {
                        onChange: (e) => {
                          const formatted = formatCPF(e.target.value);
                          form.setValue('cpf', formatted);
                          setCpfStatus('idle');
                        }
                      })}
                      onBlur={handleCpfBlur}
                    />
                    {cpfStatus === 'checking' && (
                      <div className="absolute right-3 top-3 w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {cpfStatus === 'valid' && <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />}
                    {cpfStatus === 'invalid' && <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />}
                  </div>
                  {form.formState.errors.cpf && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-sm">{form.formState.errors.cpf.message}</AlertDescription>
                    </Alert>
                  )}
                  {cpfStatus === 'invalid' && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-sm">CPF não autorizado para cadastro</AlertDescription>
                    </Alert>
                  )}
                  {cpfStatus === 'valid' && (
                    <Alert className="py-2 border-green-500 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <AlertDescription className="text-sm text-green-700">
                        CPF autorizado para cadastro
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha (mín. 6 caracteres)"
                      className="pl-10 pr-12 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500/20 transition-all duration-200"
                      {...form.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>

                  {password && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">Força da senha:</span>
                      </div>
                      <Progress value={passwordStrength} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {passwordStrength < 25 && "Muito fraca"}
                        {passwordStrength >= 25 && passwordStrength < 50 && "Fraca"}
                        {passwordStrength >= 50 && passwordStrength < 75 && "Média"}
                        {passwordStrength >= 75 && "Forte"}
                      </p>
                    </div>
                  )}

                  {form.formState.errors.password && (
                    <Alert variant="destructive" className="py-2">
                      <AlertDescription className="text-sm">{form.formState.errors.password.message}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || cpfStatus !== 'valid'}
                  className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    "Criar Conta"
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-red-600 hover:text-red-700 transition-colors duration-200 hover:underline"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;