
import { setupWorker, rest } from 'msw';
import { loginUser, registerUser } from './authApi';

// This sets up a service worker to intercept API requests
const handlers = [
  // Handler for login requests
  rest.post('/api/login', async (req, res, ctx) => {
    try {
      const { email, password } = await req.json();
      const user = await loginUser(email, password);
      return res(
        ctx.status(200),
        ctx.json(user)
      );
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ message: error instanceof Error ? error.message : 'Error al iniciar sesión' })
      );
    }
  }),
  
  // Handler for registration requests
  rest.post('/api/register', async (req, res, ctx) => {
    try {
      const { email, name, password } = await req.json();
      const user = await registerUser(email, name, password);
      return res(
        ctx.status(200),
        ctx.json(user)
      );
    } catch (error) {
      return res(
        ctx.status(400),
        ctx.json({ message: error instanceof Error ? error.message : 'Error al registrar usuario' })
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
