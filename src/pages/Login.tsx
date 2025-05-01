
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-farm-blue">LecheGanadera</h1>
          <p className="mt-2 text-gray-600">Sistema de gestión de ganado lechero</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
