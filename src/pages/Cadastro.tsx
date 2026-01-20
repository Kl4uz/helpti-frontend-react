import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Wrench, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logoHelpTI from "@/assets/logo-helpti-bg.png";

type TipoUsuario = "empresa" | "cliente" | "tecnico" | null;

const tiposUsuario = [
  {
    tipo: "empresa" as const,
    titulo: "Empresa",
    descricao: "Cadastre sua empresa para gerenciar prestadores e clientes",
    icon: Building2,
    cor: "bg-primary",
  },
  {
    tipo: "cliente" as const,
    titulo: "Cliente",
    descricao: "Abra chamados e acompanhe o suporte técnico",
    icon: Users,
    cor: "bg-accent",
  },
  {
    tipo: "tecnico" as const,
    titulo: "Técnico",
    descricao: "Atenda chamados e gerencie suas atividades",
    icon: Wrench,
    cor: "bg-secondary",
  },
];

export default function Cadastro() {
  const navigate = useNavigate();
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoUsuario>(null);

  const handleContinuar = () => {
    if (tipoSelecionado) {
      navigate(`/cadastro/${tipoSelecionado}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <img src={logoHelpTI} alt="HelpTI" className="h-10 object-contain" />
          <Button variant="ghost" onClick={() => navigate("/login")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Login
          </Button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Bem-vindo ao HelpTI
            </h1>
            <p className="text-muted-foreground text-lg">
              Selecione o tipo de cadastro que deseja realizar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {tiposUsuario.map((tipo) => {
              const Icon = tipo.icon;
              const isSelected = tipoSelecionado === tipo.tipo;

              return (
                <Card
                  key={tipo.tipo}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-elevated ${
                    isSelected
                      ? "ring-2 ring-primary shadow-elevated scale-[1.02]"
                      : "hover:scale-[1.01]"
                  }`}
                  onClick={() => setTipoSelecionado(tipo.tipo)}
                >
                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl ${tipo.cor} flex items-center justify-center mb-4 transition-transform ${
                        isSelected ? "scale-110" : ""
                      }`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-display">{tipo.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-sm">
                      {tipo.descricao}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinuar}
              disabled={!tipoSelecionado}
              className="px-8 gap-2"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © 2026 HelpTI - Todos os direitos reservados
      </footer>
    </div>
  );
}
