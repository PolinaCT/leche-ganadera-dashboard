
// Browser-safe mock Prisma client implementation

// Type definitions to match Prisma's structure
type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

// Mock Prisma client that works in browser
class BrowserPrismaClient {
  // User operations
  user = {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      console.log('Mock Prisma: findUnique user with', where);
      const usersJson = localStorage.getItem('users');
      if (!usersJson) return null;
      
      const users = JSON.parse(usersJson) as User[];
      if (where.email) {
        return users.find(user => user.email === where.email) || null;
      }
      if (where.id) {
        return users.find(user => user.id === where.id) || null;
      }
      return null;
    },
    
    create: async ({ data }: { data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> }) => {
      console.log('Mock Prisma: Creating user', data);
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) as User[] : [];
      
      // Check if user with this email already exists
      if (users.some(user => user.email === data.email)) {
        throw new Error('User with this email already exists');
      }
      
      const newUser: User = {
        ...data,
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      return newUser;
    },
    
    update: async ({ where, data }: { where: { email?: string; id?: string }, data: Partial<User> }) => {
      console.log('Mock Prisma: Updating user', where, data);
      const usersJson = localStorage.getItem('users');
      if (!usersJson) throw new Error('User not found');
      
      const users = JSON.parse(usersJson) as User[];
      let userIndex = -1;
      
      if (where.email) {
        userIndex = users.findIndex(user => user.email === where.email);
      } else if (where.id) {
        userIndex = users.findIndex(user => user.id === where.id);
      }
      
      if (userIndex === -1) throw new Error('User not found');
      
      const updatedUser = {
        ...users[userIndex],
        ...data,
        updatedAt: new Date()
      };
      
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      
      return updatedUser;
    },
    
    upsert: async ({ 
      where, 
      update, 
      create 
    }: { 
      where: { email: string }, 
      update: Partial<User>,
      create: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
    }) => {
      console.log('Mock Prisma: Upserting user', where, update, create);
      const usersJson = localStorage.getItem('users');
      const users = usersJson ? JSON.parse(usersJson) as User[] : [];
      
      const existingUserIndex = users.findIndex(user => user.email === where.email);
      
      if (existingUserIndex !== -1) {
        // Update existing user
        const updatedUser = {
          ...users[existingUserIndex],
          ...update,
          updatedAt: new Date()
        };
        
        users[existingUserIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        return updatedUser;
      } else {
        // Create new user
        const newUser: User = {
          ...create,
          id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
      }
    }
  };

  // Initialize demo user
  async initializeDemoUser() {
    console.log('Checking for demo user...');
    
    const existingUser = await this.user.findUnique({
      where: { email: 'admin@example.com' }
    });
    
    if (!existingUser) {
      console.log('Creating demo user...');
      await this.user.create({
        data: {  // Fixed: Wrapped the user data in a 'data' object
          email: 'admin@example.com',
          name: 'Admin User',
          password: 'admin123',
          role: 'admin',
        }
      });
      console.log('Demo user created successfully in localStorage');
    } else {
      console.log('Demo user already exists in localStorage');
    }
  }
}

// Create instance
const prisma = new BrowserPrismaClient();

// Initialize demo user
if (typeof window !== 'undefined') {
  console.log('Initializing browser localStorage database');
  prisma.initializeDemoUser().catch(console.error);
}

export default prisma;
