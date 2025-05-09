
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
import { Lock, User, Mail, AlertCircle } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Correo electrónico inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  confirmPassword: z.string().min(6, { message: 'Debe confirmar la contraseña' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const { register } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setRegistrationError(null);
    try {
      await register(data.email, data.name, data.password);
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationError(error instanceof Error ? error.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Registro</CardTitle>
        <CardDescription className="text-center">
          Crea una cuenta para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>Los datos se guardarán en localStorage del navegador.</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {registrationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm mb-4">
                {registrationError}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <div className="flex items-center border rounded-md">
                      <div className="px-3 py-2 border-r">
                        <User size={20} className="text-gray-500" />
                      </div>
                      <Input
                        className="flex-1 border-0 focus-visible:ring-0"
                        placeholder="Tu nombre completo"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <div className="flex items-center border rounded-md">
                      <div className="px-3 py-2 border-r">
                        <Mail size={20} className="text-gray-500" />
                      </div>
                      <Input
                        className="flex-1 border-0 focus-visible:ring-0"
                        placeholder="correo@ejemplo.com"
                        type="email"
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
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
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
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="underline text-primary">
            Iniciar sesión
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
