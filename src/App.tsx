
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FarmProvider } from "./context/FarmContext";
import { AuthProvider } from "./context/AuthContext";
import { startApiWorker } from "./api/apiHandlers";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import AnimalDetail from "./pages/AnimalDetail";
import Births from "./pages/Births";
import MilkProduction from "./pages/MilkProduction";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

// Initialize MSW in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Initializing API mocking...');
  // Start the worker with a delay to ensure everything else is loaded
  setTimeout(() => {
    startApiWorker();
  }, 100);
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <FarmProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/inventario" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/inventario/:id" element={<ProtectedRoute><AnimalDetail /></ProtectedRoute>} />
              <Route path="/partos" element={<ProtectedRoute><Births /></ProtectedRoute>} />
              <Route path="/produccion" element={<ProtectedRoute><MilkProduction /></ProtectedRoute>} />
              <Route path="/reportes" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </FarmProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
