
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
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
      const data: LoginRequest = await request.json();
      const user = await loginUser(data.email, data.password);
      return HttpResponse.json(user, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        { message: error instanceof Error ? error.message : 'Error al iniciar sesión' },
        { status: 400 }
      );
    }
  }),
  
  // Handler for registration requests
  http.post('/api/register', async ({ request }) => {
    try {
      const data: RegisterRequest = await request.json();
      const user = await registerUser(data.email, data.name, data.password);
      return HttpResponse.json(user, { status: 200 });
    } catch (error) {
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
export const startApiWorker = () => {
  // Don't actually start in production mode
  if (process.env.NODE_ENV !== 'production') {
    worker.start({
      onUnhandledRequest: 'bypass', // To avoid logging unhandled requests
    });
    console.log('API Mock Service Worker started');
  }
};
