
// Real Prisma client implementation for PostgreSQL

import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma client
const prisma = global.prisma || new PrismaClient();

// Only do this in development to avoid memory leaks
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

// Initialize demo user for development
async function initializeDemoUser() {
  try {
    console.log('Checking for demo user...');
    
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (!existingUser) {
      console.log('Creating demo user...');
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin User',
          password: 'admin123', // Plain text for demo only
          role: 'admin',
        }
      });
      console.log('Demo user created successfully in PostgreSQL database');
    } else {
      console.log('Demo user already exists in PostgreSQL database');
    }
  } catch (error) {
    console.error('Error initializing demo user:', error);
    console.log('Using fallback localStorage mode due to database connection error');
    setupLocalStorageFallback();
  }
}

// Fallback to localStorage if database connection fails
function setupLocalStorageFallback() {
  console.log('Setting up localStorage fallback for development');
  if (typeof window !== 'undefined') {
    try {
      // Check if we already have users in localStorage
      let users: any[] = [];
      
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
        const demoUser = {
          id: 'demo-user-1',
          email: 'admin@example.com',
          name: 'Admin User',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        users = [demoUser];
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Demo user created successfully in localStorage (fallback mode)');
      }
    } catch (error) {
      console.error('Error initializing localStorage fallback:', error);
    }
  }
}

// Call initialization function
if (typeof window !== 'undefined') {
  console.log('Running in browser environment, initializing database connection');
  initializeDemoUser()
    .catch(error => {
      console.error('Database initialization error:', error);
      setupLocalStorageFallback();
    });
}

export default prisma;
