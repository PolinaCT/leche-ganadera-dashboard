
// This is a browser-friendly mock implementation of Prisma client
// Since Prisma is a Node.js library, we need to create a mock for browser use

interface User {
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
      try {
        // Get users from localStorage
        const usersJson = localStorage.getItem('users');
        if (!usersJson) return null;
        
        const users: User[] = JSON.parse(usersJson);
        return users.find(user => user.email === where.email) || null;
      } catch (error) {
        console.error('Error finding user:', error);
        return null;
      }
    },
    create: async ({ data }: { data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> }): Promise<User> => {
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
    // Check if we already have users in localStorage
    const usersJson = localStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    // If no users exist, add demo user
    if (users.length === 0) {
      const demoUser: User = {
        id: 'demo-user-1',
        email: 'admin@example.com',
        name: 'Admin User',
        // This is the hashed version of 'admin123'
        password: '$2a$10$2rlBJIxG4GHwlHAW0qQs6OWMruNHxyn.PF4pEZUJKL6EbgqKFXFi2',
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

// Create and export our mock client
const prismaClient = new MockPrismaClient();

// Initialize demo user when this module is imported
// We need to check if we're in a browser environment first
if (typeof window !== 'undefined') {
  initializeDemoUser();
  console.log('Using mock Prisma client for browser environment');
}

export default prismaClient;
