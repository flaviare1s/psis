import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistidos" element={<Assistidos />} />
            <Route path="/assistidos/:id" element={<AssistidoDetalhe />} />
            <Route path="/atendimentos" element={<Atendimentos />} />
            <Route path="/metricas" element={<Metricas />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
