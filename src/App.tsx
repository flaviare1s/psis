import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assistidos from "./pages/Assistidos";
import AssistidoDetalhe from "./pages/AssistidoDetalhe";
import Atendimentos from "./pages/Atendimentos";
import Metricas from "./pages/Metricas";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assistidos"
              element={
                <ProtectedRoute>
                  <Assistidos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assistidos/:id"
              element={
                <ProtectedRoute>
                  <AssistidoDetalhe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/atendimentos"
              element={
                <ProtectedRoute>
                  <Atendimentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/metricas"
              element={
                <ProtectedRoute>
                  <Metricas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <Configuracoes />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
