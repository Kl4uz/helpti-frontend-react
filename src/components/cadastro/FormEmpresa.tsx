import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import logoHelpTI from "@/assets/logo-helpti-bg.png";

const empresaSchema = z.object({
  nomeFantasia: z.string().min(3, "Nome fantasia deve ter pelo menos 3 caracteres").max(100),
  emailResponsavel: z.string().email("Email inválido").max(255),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido (formato: 00.000.000/0001-00)"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(50),
  confirmarSenha: z.string(),
  tipoEmpresa: z.string().min(1, "Selecione o tipo de empresa"),
  prestadoraId: z.string().optional(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

interface Prestadora {
  id: number;
  nomeFantasia: string;
}

const tiposEmpresa = [
  { value: "0", label: "Matriz (Dona do Software)" },
  { value: "1", label: "Prestadora de Serviços" },
  { value: "2", label: "Cliente Final" },
];

export default function FormEmpresa() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [prestadoras, setPrestadoras] = useState<Prestadora[]>([]);
  const [loadingPrestadoras, setLoadingPrestadoras] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
  });

  const tipoEmpresa = watch("tipoEmpresa");

  // Carrega prestadoras quando o tipo for "1" (Prestadora) ou "2" (Cliente)
  useEffect(() => {
    if (tipoEmpresa === "1" || tipoEmpresa === "2") {
      loadPrestadoras();
    }
  }, [tipoEmpresa]);

  const loadPrestadoras = async () => {
    try {
      setLoadingPrestadoras(true);
      const response = await api.get("/api/empresas/prestadoras");
      setPrestadoras(response.data);
    } catch (error) {
      console.warn("Erro ao carregar prestadoras:", error);
    } finally {
      setLoadingPrestadoras(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const onSubmit = async (data: EmpresaFormData) => {
    try {
      setLoading(true);
      
      await api.post("/api/empresas", {
        nomeFantasia: data.nomeFantasia.trim(),
        emailResponsavel: data.emailResponsavel.trim(),
        cnpj: data.cnpj,
        tipoEmpresa: Number(data.tipoEmpresa),
        prestadoraId: data.prestadoraId ? Number(data.prestadoraId) : null,
        senha: data.senha,
      });

      toast({
        title: "Empresa cadastrada!",
        description: "Sua empresa foi registrada com sucesso.",
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <img src={logoHelpTI} alt="HelpTI" className="h-10 object-contain" />
          <Button variant="ghost" onClick={() => navigate("/cadastro")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg animate-fade-in">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-display">Cadastro de Empresa</CardTitle>
            <CardDescription>
              Preencha os dados da sua empresa para começar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  placeholder="Minha Empresa LTDA"
                  {...register("nomeFantasia")}
                />
                {errors.nomeFantasia && (
                  <p className="text-sm text-destructive">{errors.nomeFantasia.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailResponsavel">Email do Responsável</Label>
                <Input
                  id="emailResponsavel"
                  type="email"
                  placeholder="responsavel@empresa.com"
                  {...register("emailResponsavel")}
                />
                {errors.emailResponsavel && (
                  <p className="text-sm text-destructive">{errors.emailResponsavel.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0001-00"
                  {...register("cnpj")}
                  onChange={(e) => {
                    const formatted = formatCNPJ(e.target.value);
                    setValue("cnpj", formatted);
                  }}
                />
                {errors.cnpj && (
                  <p className="text-sm text-destructive">{errors.cnpj.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoEmpresa">Tipo de Empresa</Label>
                <Select onValueChange={(value) => setValue("tipoEmpresa", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposEmpresa.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipoEmpresa && (
                  <p className="text-sm text-destructive">{errors.tipoEmpresa.message}</p>
                )}
              </div>

              {/* Prestadora vinculada - aparece para Prestadora e Cliente */}
              {(tipoEmpresa === "1" || tipoEmpresa === "2") && (
                <div className="space-y-2">
                  <Label htmlFor="prestadoraId">
                    {tipoEmpresa === "1" ? "Matriz Vinculada" : "Prestadora Vinculada"}
                  </Label>
                  <Select onValueChange={(value) => setValue("prestadoraId", value)}>
                    <SelectTrigger>
                      <SelectValue 
                        placeholder={loadingPrestadoras ? "Carregando..." : "Selecione..."} 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {prestadoras.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nomeFantasia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="••••••"
                    {...register("senha")}
                  />
                  {errors.senha && (
                    <p className="text-sm text-destructive">{errors.senha.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="••••••"
                    {...register("confirmarSenha")}
                  />
                  {errors.confirmarSenha && (
                    <p className="text-sm text-destructive">{errors.confirmarSenha.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    Cadastrar Empresa
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2026 HelpTI - Todos os direitos reservados
      </footer>
    </div>
  );
}
