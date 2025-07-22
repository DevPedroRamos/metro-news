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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center animate-scale-in">
          <img 
            src="/lovable-uploads/181eacc0-0dbb-4e16-8c77-31c86f9c49d0.png" 
            alt="Metro News" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground">Portal Metro News</h1>
          <p className="text-muted-foreground">Crie sua conta corporativa</p>
        </div>

        <Card className="shadow-lg border-0 bg-card/90 backdrop-blur-sm animate-slide-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@metrocasa.com.br"
                    className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                    {...form.register('email')}
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

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="pl-9 pr-9 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
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
                    <div className="absolute right-3 top-3 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                  {cpfStatus === 'valid' && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-metro-green" />
                  )}
                  {cpfStatus === 'invalid' && (
                    <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-destructive" />
                  )}
                </div>
                {form.formState.errors.cpf && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">
                      {form.formState.errors.cpf.message}
                    </AlertDescription>
                  </Alert>
                )}
                {cpfStatus === 'invalid' && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">
                      CPF não autorizado para cadastro
                    </AlertDescription>
                  </Alert>
                )}
                {cpfStatus === 'valid' && (
                  <Alert className="py-2 border-metro-green bg-metro-green/10">
                    <CheckCircle className="h-4 w-4 text-metro-green" />
                    <AlertDescription className="text-sm text-metro-green">
                      CPF autorizado para cadastro
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha (mín. 6 caracteres)"
                    className="pl-9 pr-9 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                    {...form.register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Força da senha:</span>
                    </div>
                    <Progress value={passwordStrength} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {passwordStrength < 25 && "Muito fraca"}
                      {passwordStrength >= 25 && passwordStrength < 50 && "Fraca"}
                      {passwordStrength >= 50 && passwordStrength < 75 && "Média"}
                      {passwordStrength >= 75 && "Forte"}
                    </p>
                  </div>
                )}
                
                {form.formState.errors.password && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">
                      {form.formState.errors.password.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading || cpfStatus !== 'valid'}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link 
                  to="/login" 
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-200 hover:underline"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;