
import prisma from '@/lib/prisma';

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

    // Create new user with plaintext password for demo
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: password, // Store plaintext for demo
        role: 'user', // Default role
      },
    });

    console.log('User registered successfully:', email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
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
    
    // Simple direct password comparison for demo
    const isPasswordValid = user.password === password;
    console.log('Password validation result:', isPasswordValid);
    
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
