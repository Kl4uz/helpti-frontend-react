import { MessageCircle, Phone, Headphones, Shield, Monitor, Settings, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoHelpTI from "@/assets/logo-helpti.jpg";

const WHATSAPP_NUMBER = "5511999999999"; // Substituir pelo número real
const WHATSAPP_MESSAGE = "Olá! Gostaria de falar com um técnico de TI.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const services = [
  {
    icon: Headphones,
    title: "Suporte Técnico Remoto e Presencial",
    description: "Assistência rápida onde você estiver, seja à distância ou com visita técnica.",
  },
  {
    icon: Monitor,
    title: "Manutenção de Computadores e Notebooks",
    description: "Preventiva e corretiva para manter seus equipamentos sempre funcionando.",
  },
  {
    icon: Settings,
    title: "Instalação e Configuração de Softwares",
    description: "Instalamos e configuramos os programas que você precisa para trabalhar.",
  },
  {
    icon: Shield,
    title: "Formatação e Otimização de Sistemas",
    description: "Deixamos seu computador mais rápido e seguro com a configuração ideal.",
  },
  {
    icon: CheckCircle,
    title: "Segurança da Informação",
    description: "Antivírus, firewall e orientações para proteger seus dados.",
  },
  {
    icon: Users,
    title: "Consultoria em Tecnologia",
    description: "Soluções sob medida para pequenas empresas e profissionais autônomos.",
  },
];

const differentials = [
  {
    icon: Users,
    title: "Atendimento Direto com Técnicos",
    description: "Fale direto com quem resolve. Sem robôs, sem espera.",
  },
  {
    icon: Zap,
    title: "Resposta Rápida",
    description: "Atendemos em minutos. Seu tempo é precioso.",
  },
  {
    icon: MessageCircle,
    title: "Linguagem Simples",
    description: "Explicamos tudo sem 'tecniquês'. Você vai entender.",
  },
  {
    icon: CheckCircle,
    title: "Suporte Personalizado",
    description: "Cada cliente é único. Entendemos sua necessidade real.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logoHelpTI} alt="HelpTI Logo" className="h-10 w-auto" />
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Falar com Técnico
            </a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Suporte Técnico Especializado
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Problemas com seu computador?
              <br />
              <span className="text-primary">Resolvemos agora!</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Fale diretamente com um técnico de TI qualificado. 
              <strong className="text-foreground"> Atendimento rápido, humano e sem complicação.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 animate-pulse-glow"
              >
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Falar com um técnico agora
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
              >
                <a href="#servicos">
                  Ver nossos serviços
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre o Serviço */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Como funciona?
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            É simples: você nos conta seu problema pelo WhatsApp e um técnico de TI 
            <strong className="text-foreground"> real</strong> vai te ajudar imediatamente. 
            Sem burocracia, sem formulários intermináveis.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-background border border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Entre em contato</h3>
              <p className="text-muted-foreground text-sm">Clique no botão do WhatsApp e descreva seu problema.</p>
            </div>
            <div className="p-6 rounded-xl bg-background border border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-foreground" style={{ color: "hsl(var(--accent))" }}>2</span>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Receba atendimento</h3>
              <p className="text-muted-foreground text-sm">Um técnico vai responder rapidamente e entender sua situação.</p>
            </div>
            <div className="p-6 rounded-xl bg-background border border-border animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="w-14 h-14 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-secondary-foreground">3</span>
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Problema resolvido</h3>
              <p className="text-muted-foreground text-sm">Resolveremos remotamente ou agendaremos uma visita técnica.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos soluções completas de TI para você e sua empresa.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div 
                key={service.title}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Por que escolher a HelpTI?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Somos diferentes porque tratamos você como pessoa, não como número.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentials.map((diff, index) => (
              <div 
                key={diff.title}
                className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <diff.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold mb-2">{diff.title}</h3>
                <p className="text-sm opacity-80">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4 bg-gradient-to-br from-accent/10 via-background to-primary/10">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Não perca mais tempo com problemas de TI
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Clique no botão abaixo e fale agora mesmo com um técnico. 
            <strong className="text-foreground"> Estamos prontos para ajudar!</strong>
          </p>
          <Button 
            asChild 
            size="lg" 
            className="text-lg px-10 py-7 animate-pulse-glow"
          >
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-6 w-6" />
              Chamar Técnico no WhatsApp
            </a>
          </Button>
        </div>
      </section>

      {/* Contato/Footer */}
      <footer className="py-12 px-4 bg-foreground text-background">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src={logoHelpTI} alt="HelpTI Logo" className="h-10 w-auto rounded bg-white p-1" />
              <div>
                <h3 className="font-display font-semibold text-lg">HelpTI</h3>
                <p className="text-sm opacity-80">Soluções de TI simplificadas</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-background/30 text-background hover:bg-background/10"
              >
                <a href="tel:+5511999999999">
                  <Phone className="mr-2 h-5 w-5" />
                  Ligar Agora
                </a>
              </Button>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-background/20 text-center">
            <p className="text-sm opacity-70">
              © {new Date().getFullYear()} HelpTI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
