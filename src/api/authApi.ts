
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

    console.log('User registered successfully in PostgreSQL database:', email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
      
  } catch (error) {
    console.error('Registration error:', error);
    // Check if this is a database connection error
    if (error instanceof Error && error.message.includes('connect ECONNREFUSED')) {
      console.warn('Database connection failed, using localStorage fallback');
      return registerUserLocalStorage(email, name, password);
    }
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
    // Check if this is a database connection error
    if (error instanceof Error && error.message.includes('connect ECONNREFUSED')) {
      console.warn('Database connection failed, using localStorage fallback');
      return loginUserLocalStorage(email, password);
    }
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Error al verificar credenciales');
    }
  }
};

// Fallback functions using localStorage
const registerUserLocalStorage = async (email: string, name: string, password: string) => {
  console.log('Registering user in localStorage (fallback mode):', email);
  
  try {
    // Get existing users or initialize empty array
    const usersJson = localStorage.getItem('users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    
    // Check if user already exists
    const existingUser = users.find((user: any) => user.email === email);
    if (existingUser) {
      throw new Error('El correo electrónico ya está en uso');
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      password,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('User created successfully in localStorage (fallback mode)');
    
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error in localStorage registration:', error);
    throw error;
  }
};

const loginUserLocalStorage = async (email: string, password: string) => {
  console.log('Attempting login using localStorage (fallback mode):', email);
  
  try {
    // Get users from localStorage
    const usersJson = localStorage.getItem('users');
    if (!usersJson) {
      console.log('No users found in localStorage');
      throw new Error('Credenciales inválidas');
    }
    
    const users = JSON.parse(usersJson);
    const foundUser = users.find((user: any) => user.email === email);
    
    if (!foundUser) {
      console.log('User not found in localStorage:', email);
      throw new Error('Credenciales inválidas');
    }
    
    const isPasswordValid = foundUser.password === password;
    
    if (!isPasswordValid) {
      console.log('Invalid password in localStorage for user:', email);
      throw new Error('Credenciales inválidas');
    }
    
    console.log('Login successful using localStorage (fallback mode)');
    
    const { password: _, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error in localStorage login:', error);
    throw error;
  }
};
