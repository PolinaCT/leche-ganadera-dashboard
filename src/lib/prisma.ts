
// This is a browser-friendly mock implementation of Prisma client
// Since Prisma is a Node.js library, we need to create a mock for browser use

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock PrismaClient for browser environments
class MockPrismaClient {
  user = {
    findUnique: async ({ where }: { where: { email?: string } }): Promise<User | null> => {
      console.log('Mock findUnique looking for user with email:', where.email);
      try {
        // Get users from localStorage
        const usersJson = localStorage.getItem('users');
        if (!usersJson) {
          console.log('No users found in localStorage');
          return null;
        }
        
        const users: User[] = JSON.parse(usersJson);
        const foundUser = users.find(user => user.email === where.email);
        console.log('User found:', foundUser ? 'yes' : 'no');
        return foundUser || null;
      } catch (error) {
        console.error('Error finding user:', error);
        return null;
      }
    },
    create: async ({ data }: { data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> }): Promise<User> => {
      console.log('Mock creating new user with email:', data.email);
      try {
        // Get existing users or initialize empty array
        const usersJson = localStorage.getItem('users');
        const users: User[] = usersJson ? JSON.parse(usersJson) : [];
        
        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Add to users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('User created successfully');
        
        return newUser;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    }
  }
}

// Initialize the demo user in localStorage
const initializeDemoUser = () => {
  try {
    console.log('Initializing demo user...');
    
    // Check if we already have users in localStorage
    let users: User[] = [];
    
    try {
      const usersJson = localStorage.getItem('users');
      if (usersJson) {
        users = JSON.parse(usersJson);
        console.log('Found existing users in localStorage:', users.length);
      }
    } catch (e) {
      console.error('Error parsing users from localStorage, resetting:', e);
      localStorage.removeItem('users');
    }
    
    // If no users exist or if we couldn't parse the JSON, add demo user
    if (!users.length) {
      const demoUser: User = {
        id: 'demo-user-1',
        email: 'admin@example.com',
        name: 'Admin User',
        // This is a plaintext password for demo purposes as bcryptjs has issues in the browser
        password: 'admin123',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users = [demoUser];
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Demo user created successfully:', demoUser.email);
    }
  } catch (error) {
    console.error('Error initializing demo user:', error);
  }
};

// Create and export our mock client
const prismaClient = new MockPrismaClient();

// Initialize demo user when this module is imported
// We need to check if we're in a browser environment first
if (typeof window !== 'undefined') {
  console.log('Running in browser environment, initializing demo user');
  initializeDemoUser();
}

export default prismaClient;
