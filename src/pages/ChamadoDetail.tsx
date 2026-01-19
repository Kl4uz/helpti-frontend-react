import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  ArrowLeft, 
  UserCog, 
  CheckCircle, 
  MapPin, 
  Paperclip,
  Send,
  AlertCircle,
  Clock,
  User,
  Building,
  Calendar
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/services/api";

// --- Tipos de Dados ---
interface Nota {
  id: number;
  texto: string;
  dataCriacao: string;
  autorNome: string;
  autorTipo: string;
}

interface Anexo {
  id: number;
  urlArquivo: string;
  nomeOriginal: string;
  tipoArquivo: string;
}

interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  prioridade: string;
  dataAbertura: string;
  latitude?: string;
  longitude?: string;
  cliente: { nome: string; email: string; empresaDoCliente: string };
  tecnico?: { id: number; nome: string };
  notas: Nota[];
  anexos: Anexo[];
  solucao?: string;
}

interface Tecnico {
  id: number;
  nome: string;
}

interface Categoria {
  id: number;
  nome: string;
}

interface SubCategoria {
  id: number;
  nome: string;
  categoria: { id: number };
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "ABERTO":
      return { label: "Aberto", variant: "accent" as const, icon: AlertCircle };
    case "EM_ATENDIMENTO":
      return { label: "Em Andamento", variant: "primary" as const, icon: Clock };
    case "FECHADO":
      return { label: "Finalizado", variant: "secondary" as const, icon: CheckCircle };
    default:
      return { label: status, variant: "outline" as const, icon: AlertCircle };
  }
};

const getPrioridadeConfig = (prioridade: string) => {
  switch (prioridade) {
    case "ALTA":
      return { label: "Alta", className: "text-destructive font-bold" };
    case "MEDIA":
      return { label: "Média", className: "text-accent font-semibold" };
    case "BAIXA":
      return { label: "Baixa", className: "text-muted-foreground" };
    default:
      return { label: prioridade, className: "text-foreground" };
  }
};

export function ChamadoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState<Chamado | null>(null);
  const [novaNota, setNovaNota] = useState("");
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [mostrarTransferir, setMostrarTransferir] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enviandoNota, setEnviandoNota] = useState(false);

  // Estados do Modal de Finalização
  const [modalFinalizarAberto, setModalFinalizarAberto] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([]);
  const [solucao, setSolucao] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [subCategoriaSelecionada, setSubCategoriaSelecionada] = useState("");

  const loadDados = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/chamados/${id}`);
      setChamado(response.data);

      const techResponse = await api.get("/api/tecnicos/ativos");
      setTecnicos(techResponse.data);

      try {
        const catRes = await api.get("/api/categorias");
        setCategorias(catRes.data);
        const subRes = await api.get("/api/categorias/subcategorias");
        setSubCategorias(subRes.data);
      } catch (e) {
        console.warn("Erro ao carregar categorias");
      }
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDados();
  }, [id]);

  const handleEnviarNota = async () => {
    if (!novaNota.trim()) return;
    try {
      setEnviandoNota(true);
      const token = localStorage.getItem("helpti_token");
      const decoded: { sub: string; roles: string[] } = jwtDecode(token!);
      const userRole = decoded.roles[0];
      const userEmail = decoded.sub;

      await api.post(`/api/chamados/${id}/notas`, {
        texto: novaNota,
        autorNome: userEmail,
        autorTipo: userRole.replace("ROLE_", ""),
      });

      setNovaNota("");
      loadDados();
    } catch (error) {
      console.error("Erro ao enviar nota:", error);
    } finally {
      setEnviandoNota(false);
    }
  };

  const handleTransferir = async (tecnicoId: string) => {
    if (!tecnicoId) return;
    try {
      await api.put(`/api/chamados/${id}/transferir`, { tecnicoId: Number(tecnicoId) });
      setMostrarTransferir(false);
      loadDados();
    } catch (error) {
      console.error("Erro ao transferir chamado:", error);
    }
  };

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/api/chamados/${id}/fechar`, {
        solucao,
        categoriaId: Number(categoriaSelecionada),
        subCategoriaId: Number(subCategoriaSelecionada),
      });
      setModalFinalizarAberto(false);
      loadDados();
    } catch (error) {
      console.error("Erro ao finalizar chamado:", error);
    }
  };

  const handleAbrirMapa = () => {
    if (chamado?.latitude && chamado?.longitude) {
      const url = `https://www.google.com/maps?q=${chamado.latitude},${chamado.longitude}`;
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (!chamado) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground text-lg">Chamado não encontrado</p>
          <Button onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(chamado.status);
  const prioridadeConfig = getPrioridadeConfig(chamado.prioridade);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto px-4 py-6 max-w-7xl animate-fade-in">
        {/* Header do Chamado */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-1.5 h-12 bg-accent rounded-full shrink-0" />
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
                #{chamado.id} — {chamado.titulo}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4" />
                Aberto em {new Date(chamado.dataAbertura).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>

          <Badge
            variant={statusConfig.variant}
            className="self-start md:self-center px-4 py-1.5 text-sm font-semibold"
          >
            <StatusIcon className="h-4 w-4 mr-1.5" />
            {statusConfig.label}
          </Badge>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Histórico e Ações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barra de Ações */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>

                  <div className="h-6 w-px bg-border hidden sm:block" />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMostrarTransferir(!mostrarTransferir)}
                    className="text-primary hover:text-primary/80"
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Mudar Proprietário
                  </Button>

                  {chamado.status !== "FECHADO" && (
                    <>
                      <div className="h-6 w-px bg-border hidden sm:block" />
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setModalFinalizarAberto(true)}
                        className="text-secondary hover:text-secondary/80"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Finalizar Chamado
                      </Button>
                    </>
                  )}
                </div>

                {/* Dropdown de Transferência */}
                {mostrarTransferir && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Label className="text-sm text-muted-foreground mb-2 block">
                      Selecione o novo técnico:
                    </Label>
                    <Select onValueChange={handleTransferir}>
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tecnicos.map((t) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <div className="space-y-4">
              {/* Descrição Original */}
              <Card className="border-l-4 border-l-accent bg-accent/5">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-accent">Descrição do Problema</h3>
                    <span className="text-sm text-muted-foreground">{chamado.cliente.nome}</span>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{chamado.descricao}</p>

                  {/* Anexos */}
                  {chamado.anexos && chamado.anexos.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-accent/20">
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                        <Paperclip className="h-4 w-4" />
                        Anexos do Cliente ({chamado.anexos.length}):
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {chamado.anexos.map((anexo) => (
                          <a
                            key={anexo.id}
                            href={`http://localhost:8082/uploads/${anexo.urlArquivo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 p-2 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                          >
                            {anexo.tipoArquivo.includes("image") ? (
                              <img
                                src={`http://localhost:8082/uploads/${anexo.urlArquivo}`}
                                alt={anexo.nomeOriginal}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
                                📄
                              </div>
                            )}
                            <span className="text-xs text-muted-foreground group-hover:text-primary max-w-[100px] truncate">
                              {anexo.nomeOriginal}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notas */}
              {chamado.notas.map((nota) => (
                <Card key={nota.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{nota.autorNome}</span>
                        <Badge variant="outline" className="text-xs">
                          {nota.autorTipo}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(nota.dataCriacao).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{nota.texto}</p>
                  </CardContent>
                </Card>
              ))}

              {/* Solução Final */}
              {chamado.status === "FECHADO" && chamado.solucao && (
                <Card className="border-l-4 border-l-secondary bg-secondary/5">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Solução Final
                    </h3>
                    <p className="text-foreground whitespace-pre-wrap">{chamado.solucao}</p>
                  </CardContent>
                </Card>
              )}

              {/* Nova Nota */}
              {chamado.status !== "FECHADO" && (
                <Card>
                  <CardContent className="p-5">
                    <Textarea
                      value={novaNota}
                      onChange={(e) => setNovaNota(e.target.value)}
                      placeholder="Escreva uma nota interna, resposta ou atualização..."
                      rows={4}
                      className="resize-none mb-4"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleEnviarNota}
                        disabled={!novaNota.trim() || enviandoNota}
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Adicionar Nota
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Coluna Direita - Informações */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="bg-muted/50 border-b border-border">
                <CardTitle className="text-base font-semibold text-muted-foreground">
                  Informação do Chamado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div>
                  <span className="text-sm text-muted-foreground">Prioridade:</span>
                  <p className={prioridadeConfig.className}>{prioridadeConfig.label}</p>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    Cliente:
                  </span>
                  <p className="font-medium text-foreground">{chamado.cliente.nome}</p>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="h-3.5 w-3.5" />
                    Empresa:
                  </span>
                  <p className="font-medium text-foreground">{chamado.cliente.empresaDoCliente}</p>
                </div>

                {/* Localização */}
                {chamado.latitude && chamado.longitude ? (
                  <div className="pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground mb-2 block">Localização:</span>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/5"
                      onClick={handleAbrirMapa}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Ir até o Cliente
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      GPS: {chamado.latitude}, {chamado.longitude}
                    </p>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localização não informada
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">Proprietário Atual:</span>
                  {chamado.tecnico ? (
                    <p className="font-medium text-primary">{chamado.tecnico.nome}</p>
                  ) : (
                    <p className="text-muted-foreground italic">-- Ninguém --</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de Finalização */}
      <Dialog open={modalFinalizarAberto} onOpenChange={setModalFinalizarAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Finalizar Chamado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFinalizar} className="space-y-4">
            <div className="space-y-2">
              <Label>Solução:</Label>
              <Textarea
                value={solucao}
                onChange={(e) => setSolucao(e.target.value)}
                required
                rows={3}
                placeholder="Descreva a solução aplicada..."
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria:</Label>
              <Select value={categoriaSelecionada} onValueChange={setCategoriaSelecionada} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo:</Label>
              <Select
                value={subCategoriaSelecionada}
                onValueChange={setSubCategoriaSelecionada}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {subCategorias
                    .filter((s) => s.categoria?.id === Number(categoriaSelecionada))
                    .map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalFinalizarAberto(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChamadoDetail;
