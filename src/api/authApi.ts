
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

// Function to register users
export const registerUser = async (email: string, name: string, password: string) => {
  try {
    console.log('Registering user:', email);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      throw new Error('El correo electrónico ya está en uso');
    }

    // Hash password
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'user', // Default role
        },
      });

      console.log('User registered successfully:', email);

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
      
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      throw new Error('Error al registrar el usuario');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Function for login
export const loginUser = async (email: string, password: string) => {
  console.log('Attempting login for:', email);
  
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found:', email);
      throw new Error('Credenciales inválidas');
    }

    console.log('User found, verifying password');
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      throw new Error('Credenciales inválidas');
    }

    console.log('Login successful for user:', email);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
      
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Error al verificar credenciales');
    }
  }
};
