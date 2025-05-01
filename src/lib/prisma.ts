
import { PrismaClient } from '@prisma/client';

// Mock implementation for browser environment
class MockPrismaClient {
  user = {
    findUnique: async ({ where }) => {
      // Get users from localStorage or return null
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.find(user => user.email === where.email) || null;
    },
    create: async ({ data }) => {
      // Store user in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const newUser = {
        id: `user-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return newUser;
    }
  }
}

// Use mock in browser, real client in Node environment
const isBrowser = typeof window !== 'undefined';
const prismaClient = isBrowser ? new MockPrismaClient() : new PrismaClient();

export default prismaClient;
