import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { TicketListItem } from "@/components/dashboard/TicketListItem";
import { Chamado } from "@/types/ticket";
import api from "@/services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    async function loadChamados() {
      try {
        const response = await api.get("/api/chamados");
        setChamados(response.data);
      } catch (error) {
        console.error("Erro ao buscar chamados", error);
      } finally {
        setLoading(false);
      }
    }
    loadChamados();
  }, []);

  const token = localStorage.getItem("helpti_token");
  const totalAbertos = chamados.filter((c) => c.status === "ABERTO").length;
  const totalEmAndamento = chamados.filter((c) => c.status === "EM_ATENDIMENTO").length;
  const totalFechados = chamados.filter((c) => c.status === "FECHADO").length;

  const chamadosFiltrados = chamados.filter(
    (c) =>
      c.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      c.id.toString().includes(filtro)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <Navbar />
      <p>{token}</p>
      {/* Header Section */}
      <div className="bg-card shadow-soft w-full border-b border-border">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Painel do Cliente
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas solicitações de suporte técnico.
              </p>
            </div>
            <Button
              onClick={() => navigate("/cliente/novo-chamado")}
              className="shadow-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Chamado
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <StatusCard
              title="Pendentes"
              count={totalAbertos}
              icon={<AlertCircle className="h-6 w-6" />}
              variant="pending"
            />
            <StatusCard
              title="Em Andamento"
              count={totalEmAndamento}
              icon={<Clock className="h-6 w-6" />}
              variant="progress"
            />
            <StatusCard
              title="Finalizados"
              count={totalFechados}
              icon={<CheckCircle className="h-6 w-6" />}
              variant="completed"
            />
          </div>

          {/* Tickets List Section */}
          <div
            className="bg-card rounded-xl shadow-soft border border-border overflow-hidden animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {/* List Header */}
            <div className="p-6 border-b border-border bg-muted/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2 font-display">
                <Ticket className="h-5 w-5 text-primary" />
                Histórico de Chamados
              </h2>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por ID ou título..."
                  className="pl-10"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>

            {/* List Content */}
            <div className="bg-card">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando informações...</p>
                </div>
              ) : chamadosFiltrados.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">
                    Nenhum chamado encontrado
                  </h3>
                  <p className="text-muted-foreground mt-1">
                    Tente buscar por outro termo ou abra um novo chamado.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {chamadosFiltrados.map((chamado) => (
                    <TicketListItem
                      key={chamado.id}
                      chamado={chamado}
                      onClick={() => navigate(`/chamado/${chamado.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
