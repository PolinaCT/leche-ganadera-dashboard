
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setIsLoading(true);
    setLoginError(null);
    
    // Demo credentials
    const demoEmail = 'admin@example.com';
    const demoPassword = 'admin123';
    
    try {
      // Pre-fill the form with demo credentials for visual feedback
      form.setValue('email', demoEmail);
      form.setValue('password', demoPassword);
      
      // Login with demo credentials
      await login(demoEmail, demoPassword);
    } catch (error) {
      console.error('Demo login error:', error);
      setLoginError(error instanceof Error ? error.message : 'Error al iniciar sesión con usuario de prueba');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
        <CardDescription className="text-center">
          Introduce tus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm mb-4">
                {loginError}
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <div className="flex items-center border rounded-md">
                      <div className="px-3 py-2 border-r">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <Input
                        className="flex-1 border-0 focus-visible:ring-0"
                        placeholder="correo@ejemplo.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <div className="flex items-center border rounded-md">
                      <div className="px-3 py-2 border-r">
                        <Lock size={20} className="text-gray-500" />
                      </div>
                      <Input
                        className="flex-1 border-0 focus-visible:ring-0"
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-4">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={loginAsDemo}
            disabled={isLoading}
          >
            Iniciar con usuario de prueba
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link to="/registro" className="underline text-primary">
            Regístrate
          </Link>
        </div>
        <div className="text-center text-xs text-muted-foreground">
          Usuario de prueba: admin@example.com / admin123
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
