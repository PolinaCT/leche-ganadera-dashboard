
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, name: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar si hay un usuario en localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Login attempt with:', email);
      
      let userData;
      
      try {
        // Primero intentamos usar la API ficticia a través de MSW
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          userData = await response.json();
          console.log('Successfully logged in via API');
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Error al iniciar sesión');
        }
      } catch (apiError) {
        console.warn('API login failed, falling back to direct authentication:', apiError);
        
        // Fallback: authenticate directly with the mock service if API fails
        const user = await prisma.user.findUnique({
          where: { email },
        });
        
        if (!user) {
          throw new Error('Credenciales inválidas');
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          throw new Error('Credenciales inválidas');
        }
        
        const { password: _, ...userWithoutPassword } = user;
        userData = userWithoutPassword;
        console.log('Successfully logged in via direct authentication');
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string) => {
    try {
      setIsLoading(true);
      
      try {
        // Primero intentamos usar la API ficticia a través de MSW
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password }),
        });

        if (response.ok) {
          console.log('Successfully registered via API');
        } else {
          const error = await response.json();
          throw new Error(error.message || 'Error al registrar usuario');
        }
      } catch (apiError) {
        console.warn('API registration failed, falling back to direct registration:', apiError);
        
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
  
        if (existingUser) {
          throw new Error('El correo electrónico ya está en uso');
        }
  
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            role: 'user', // Default role
          },
        });
        
        console.log('Successfully registered via direct registration');
      }

      toast.success('Usuario registrado correctamente');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error instanceof Error ? error.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Sesión cerrada');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
