
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

// Función para registro de usuarios
export const registerUser = async (email: string, name: string, password: string) => {
  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('El correo electrónico ya está en uso');
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el nuevo usuario
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'user', // Rol por defecto
    },
  });

  // Retornamos usuario sin la contraseña
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Función para login
export const loginUser = async (email: string, password: string) => {
  // Buscar el usuario
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Retornamos usuario sin la contraseña
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
