import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NovoChamado from "./pages/NovoChamado";
import TecnicoDashboard from "./pages/TecnicoDashboard";
import NotFound from "./pages/NotFound";
import { ChamadoDetail } from "./pages/ChamadoDetail";
import Cadastro from "./pages/Cadastro";
import FormEmpresa from "./components/cadastro/FormEmpresa";
import FormCliente from "./components/cadastro/FormCliente";
import FormTecnico from "./components/cadastro/FormTecnico";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/cadastro/empresa" element={<FormEmpresa />} />
          <Route path="/cadastro/cliente" element={<FormCliente />} />
          <Route path="/cadastro/tecnico" element={<FormTecnico />} />
          <Route path="/cliente/dashboard" element={<Dashboard />} />
          <Route path="/cliente/novo-chamado" element={<NovoChamado />} />
          <Route path="/tecnico/dashboard" element={<TecnicoDashboard />} />
          <Route path="/chamado/:id" element={<ChamadoDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
