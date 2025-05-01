
import { PrismaClient } from '@prisma/client';

// Define the User type for our mock implementation
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock implementation for browser environment
class MockPrismaClient {
  user = {
    findUnique: async ({ where }: { where: { email?: string } }) => {
      try {
        // Get users from localStorage or return null
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(user => user.email === where.email) || null;
      } catch (error) {
        console.error('Error finding user:', error);
        return null;
      }
    },
    create: async ({ data }: { data: { email: string, name: string, password: string, role: string } }) => {
      try {
        // Store user in localStorage
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser: User = {
          id: `user-${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user');
      }
    }
  }
}

// Create a demo user in localStorage for testing if it doesn't exist
const initializeDemoUser = () => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      // Add a demo user
      const demoUser = {
        id: 'demo-user-1',
        email: 'admin@example.com',
        name: 'Admin User',
        password: '$2a$10$2rlBJIxG4GHwlHAW0qQs6OWMruNHxyn.PF4pEZUJKL6EbgqKFXFi2', // hashed 'admin123'
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(demoUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Demo user created successfully');
    }
  } catch (error) {
    console.error('Error initializing demo user:', error);
  }
};

// Use mock in browser, real client in Node environment
const isBrowser = typeof window !== 'undefined';
let prismaClient: PrismaClient | MockPrismaClient;

if (isBrowser) {
  prismaClient = new MockPrismaClient();
  // Initialize demo user
  initializeDemoUser();
  console.log('Using mock Prisma client for browser environment');
} else {
  prismaClient = new PrismaClient();
  console.log('Using real Prisma client for Node environment');
}

export default prismaClient as any;
