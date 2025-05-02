
// Import setupWorker at the top level to avoid the "module is not defined" error
import { setupWorker } from 'msw/browser';
import { http, HttpResponse } from 'msw';
import { loginUser, registerUser } from './authApi';

// Define types for our request bodies
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

// This sets up a service worker to intercept API requests
const handlers = [
  // Handler for login requests
  http.post('/api/login', async ({ request }) => {
    try {
      console.log('Processing login request');
      const data = await request.json() as LoginRequest;
      console.log('Login attempt for email:', data.email);
      
      const user = await loginUser(data.email, data.password);
      console.log('Login successful:', user);
      
      return HttpResponse.json(user, { status: 200 });
    } catch (error) {
      console.error('Login handler error:', error);
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Error al iniciar sesión' },
        { status: 400 }
      );
    }
  }),
  
  // Handler for registration requests
  http.post('/api/register', async ({ request }) => {
    try {
      console.log('Processing registration request');
      const data = await request.json() as RegisterRequest;
      console.log('Registration attempt for email:', data.email);
      
      const user = await registerUser(data.email, data.name, data.password);
      console.log('Registration successful:', user);
      
      return HttpResponse.json(user, { status: 200 });
    } catch (error) {
      console.error('Registration handler error:', error);
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Error al registrar usuario' },
        { status: 400 }
      );
    }
  }),
];

// Initialize the service worker
export const worker = setupWorker(...handlers);

// Start the service worker
export const startApiWorker = async () => {
  // Only start in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting MSW worker...');
    try {
      // Ensure mockServiceWorker.js is available by directly creating it
      await fetch('/mockServiceWorker.js')
        .catch(() => {
          console.warn('mockServiceWorker.js not available, using fallback mode');
          return { ok: false };
        });
      
      // Add a manual delay to ensure the worker has time to register
      setTimeout(() => {
        worker.start({
          onUnhandledRequest: 'bypass', // To avoid logging unhandled requests
          quiet: true, // Reduce console noise
        })
        .then(() => {
          console.log('API Mock Service Worker started successfully');
        })
        .catch(error => {
          console.error('Failed to start MSW worker:', error);
          console.log('Continuing in fallback mode without MSW');
        });
      }, 500);
    } catch (error) {
      console.error('Error setting up MSW worker:', error);
      console.log('Continuing in fallback mode without MSW');
    }
  }
};
